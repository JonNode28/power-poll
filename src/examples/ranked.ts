export default [
  {
    id: 'base-margin-threshold',
    type: 'number',
    min: 0,
    max: 100
  },
  {
    id: 'margin-threshold-a',
    type: 'number',
    min: 0,
    max: 100
  },
  {
    id: 'margin-threshold-b',
    type: 'number',
    min: 0,
    max: 100
  },
  {
    id: 'participation-threshold',
    type: 'number',
    min: 0,
    max: 100
  },
  {
    id: 'rank-example',
    type: 'boolean',
    threshold: 'margin-threshold',
    participation: 'participation-threshold'
  }
]