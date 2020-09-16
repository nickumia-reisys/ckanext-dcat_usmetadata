import axios from 'axios';
import slugify from 'slugify';

const EXTRAS = [
  'accessLevel',
  'accrualPeriodicity',
  'bureauCode',
  'category',
  'contactEmail',
  'contactPoint',
  'dataQuality',
  'dataLevel',
  'describedBy',
  'describedByType',
  'frequency',
  'homePage',
  'identifier',
  'isPartOf',
  'issued',
  'landingPage',
  'language',
  'license',
  'master',
  'organization',
  'publisher',
  'primaryITInvestmentUIIUSG',
  'programCode',
  'references',
  'rights',
  'spatial',
  'spatial_location_desc',
  'subagency',
  'systemOfRecordsUSG',
  'temporal',
  'temporal_start_date',
  'temporal_end_date',
  'themes',
];

/**
 * HELPERS
 */
const clone = (param) => JSON.parse(JSON.stringify(param));

/**
 * Encode extras for CKAN 2.8.2 Groups format
 */
const encodeExtras = (opts) => {
  const newOpts = clone(opts);

  let extras;
  if (opts) {
    extras = EXTRAS.map((key) => {
      return {
        key,
        value: opts[key] || '',
      };
    });
  } else {
    extras = [{}];
  }

  newOpts.extras = extras;
  return newOpts;
};

/**
 * Decode extras from CKAN 2.8.2 Groups format
 */
const decodeExtras = (opts) => {
  const newOpts = clone(opts);
  newOpts.extras.forEach((cur) => {
    newOpts[cur.key] = cur.value;
  });
  return newOpts;
};

// encode values from USMetadata format to match form values
const encodeSupplementalValues = (opts) => {
  const newOpts = clone(opts);

  if (opts.description) {
    newOpts.notes = opts.description;
  }

  if (opts.tags && opts.tags.length > 0) {
    newOpts.tag_string = opts.tags.reduce((acc, cur) => {
      if (acc.length === 0) {
        return cur.name;
      }
      return `${acc}, ${cur.name}`;
    }, '');
  }

  if (opts.license_others) {
    newOpts.license = opts.license_others;
    delete newOpts.license_others;
  }

  if (opts.rights_desc) {
    newOpts.rights = opts.rights_desc;
    delete newOpts.rights_desc;
  }

  if (opts.spatial_location_desc) {
    newOpts.spatial = opts.spatial_location_desc;
    delete newOpts.spatial_location_desc;
  }

  if (opts.temporal_start_date) {
    const start = new Date(opts.temporal_start_date).toISOString().split('T')[0]; // get yyyy-mm-dd from ISO string
    const end = new Date(opts.temporal_end_date).toISOString().split('T')[0]; // ditto
    newOpts.temporal = `${start}/${end}`;
    delete newOpts.temporal_start_date;
    delete newOpts.temporal_end_date;
  } else {
    newOpts.temporal = 'false';
  }

  return newOpts;
};

// decode values from USMetadata format to match form values
const decodeSupplementalValues = (opts) => {
  const newOpts = clone(opts);
  if (opts.tag_string) {
    newOpts.tags = opts.tag_string.split(',').map((n, i) => ({ id: i, name: n }));
  }

  if (opts.license) {
    if (['MIT', 'Open Source License'].includes(opts.license)) {
      newOpts.license = opts.license;
    } else {
      newOpts.license_others = opts.license;
      newOpts.license = 'Others';
    }
  }

  if (opts.rights) {
    newOpts.rights_desc = opts.rights;
    newOpts.rights = 'false';
  }

  if (opts.spatial) {
    newOpts.spatial_location_desc = opts.spatial;
    newOpts.spatial = true;
  }

  if (opts.temporal) {
    [newOpts.temporal_start_date, newOpts.temporal_end_date] = opts.temporal.split('/');
    newOpts.temporal = 'true';
  }
  return newOpts;
};

/**
 * API CALLS
 */

const createDataset = (ownerOrg, opts, apiUrl, apiKey) => {
  const encoded = encodeSupplementalValues(opts);
  encoded.name = slugify(opts.title, { lower: true, remove: /[*+~.()'"!:@]/g });
  encoded.owner_org = ownerOrg;
  encoded.modified = new Date();
  encoded.bureau_code = '015:11';
  encoded.program_code = '015:001';
  // encoded.temporal = '2020-12-22/2020-12-22'; // todo encode this
  // encoded.tag_string = 'tag1, tag2, tag3, tag4'; // TODO make tag string
  encoded.url = opts.url;
  return axios
    .post(`${apiUrl}package_create`, encoded, {
      headers: {
        'X-CKAN-API-Key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => {
      // note that we don't return the axios response, we return the result
      const resVals = res.data.result;
      const decoded = decodeSupplementalValues(decodeExtras(resVals));
      return decoded;
    });
};

const createResource = (packageId, opts, apiUrl, apiKey) => {
  let body;
  if (opts.upload) {
    body = new FormData();
    body.append('package_id', packageId);
    Object.keys(opts).forEach((item) => {
      body.append(item, opts[item]);
    });
  } else {
    body = clone(opts);
    body.package_id = packageId;
  }

  return axios.post(`${apiUrl}resource_create`, body, {
    headers: {
      'X-CKAN-API-Key': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

const fetchDataset = async (id, apiUrl, apiKey) => {
  return axios
    .get(`${apiUrl}package_show?id=${id}`, {
      headers: {
        'X-CKAN-API-Key': apiKey,
      },
    })
    .then((res) => {
      // note that we don't return the axios response, we return the result
      const decoded = decodeSupplementalValues(decodeExtras(res.data.result));
      decoded.description = decoded.notes;
      return decoded;
    });
};

const updateDataset = (id, opts, apiUrl, apiKey) => {
  const encoded = encodeSupplementalValues(opts);
  encoded.modified = new Date();
  encoded.notes = opts.description; // TODO not sure what notes is supposed to be
  encoded.id = id;

  // TODO where do we get these?
  encoded.bureauCode = '015:11';
  encoded.programCode = '015:001';

  return axios
    .post(`${apiUrl}package_update`, encoded, {
      headers: {
        'X-CKAN-API-Key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => {
      // note that we don't return the axios response, we return the result
      const resVals = res.data.result;
      const decoded = decodeSupplementalValues(decodeExtras(resVals));
      return decoded;
    });
};

const fetchTags = async (str, apiUrl, apiKey) => {
  try {
    const url = `${apiUrl}tag_list?query=${str}`;
    const res = await axios.get(url, {
      headers: {
        'X-CKAN-API-Key': apiKey,
      },
    });
    return res.data.result.map((row, i) => ({ id: i, name: row }));
  } catch (e) {
    return Promise.reject(e);
  }
};

export default {
  createDataset,
  updateDataset,
  fetchDataset,
  fetchTags,
  createResource,
  helpers: {
    encodeExtras,
    decodeExtras,
    clone,
  },
};
