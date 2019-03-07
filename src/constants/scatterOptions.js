
export const scatterOptions = {
  grid: {
    top: '24',
    right: '32',
    bottom: '40',
    left: '32',
  },
  xAxis: {
    name: 'Parents Socioeconomic Status',
    min: -5,
    max: 3,
    axisLabel: {
      formatter: function (val) {
        if (val === 3) {
          return 'richer →';
        }
        if (val === -5) {
          return '← poorer';
        }
        return null;
      },
      inside: false,
      margin: 8,
    }
  }
};