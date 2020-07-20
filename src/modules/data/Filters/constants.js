const columnNameField = {
  label: 'Column',
  widget: 'select',
  options: [
    'id',
    'lon',
    'lat',
    'all_ses',
    'w_ses',
    'b_ses',
    'h_ses',
    'wb_ses',
    'wh_ses',
    'wb_seg',
    'wh_seg',
    'np_seg',
    'wb_min',
    'wh_min',
    'name',
    'all_sz',
    'all_avg',
    'all_grd',
    'all_coh',
    'a_sz',
    'a_avg',
    'a_grd',
    'a_coh',
    'b_sz',
    'b_avg',
    'b_grd',
    'b_coh',
    'p_sz',
    'p_avg',
    'p_grd',
    'p_coh',
    'f_sz',
    'f_avg',
    'f_grd',
    'f_coh',
    'h_sz',
    'h_avg',
    'h_grd',
    'h_coh',
    'm_sz',
    'm_avg',
    'm_grd',
    'm_coh',
    'mf_sz',
    'mf_avg',
    'mf_grd',
    'mf_coh',
    'i_sz',
    'i_avg',
    'i_grd',
    'i_coh',
    'np_sz',
    'np_avg',
    'np_grd',
    'np_coh',
    'wa_sz',
    'pn_sz',
    'pn_avg',
    'pn_grd',
    'pn_coh',
    'wa_avg',
    'wa_grd',
    'wa_coh',
    'wb_sz',
    'wb_avg',
    'wb_grd',
    'wb_coh',
    'wh_sz',
    'wh_avg',
    'wh_grd',
    'wh_coh',
    'w_sz',
    'w_avg',
    'w_grd',
    'w_coh',
    'wi_sz',
    'wi_avg',
    'wi_grd',
    'wi_coh'
  ]
}

export const filterRuleFields = {
  startsWith: [
    columnNameField,
    { label: 'Value', widget: 'string' }
  ],
  eq: [columnNameField, { label: 'Value', widget: 'number' }],
  neq: [columnNameField, { label: 'Value', widget: 'number' }],
  gt: [columnNameField, { label: 'Value', widget: 'number' }],
  lt: [columnNameField, { label: 'Value', widget: 'number' }],
  has: [columnNameField],
  contains: [
    columnNameField,
    { label: 'Value', widget: 'string' }
  ],
  sort: [
    columnNameField,
    {
      label: 'Direction',
      widget: 'select',
      options: ['asc', 'desc']
    }
  ],
  limit: [
    {
      label: 'Amount',
      widget: 'number'
    }
  ]
}

export const defaultValues = {
  startsWith: ['id', ''],
  eq: ['id', 0],
  neq: ['id', 0],
  gt: ['id', 0],
  lt: ['id', 0],
  has: ['id'],
  contains: ['id', ''],
  sort: ['id', 'asc'],
  limit: [100]
}
