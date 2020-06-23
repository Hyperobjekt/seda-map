var colorPalette = [
  '#00a8c6', '#40c0cb', '#f0dec2', '#aee239',
  '#8fbe00', '#33e0ff', '#b3f4ff', '#e6ff99'
];

export const theme = {

  color: colorPalette,

  textStyle: {
    fontFamily: "maisonneue-book,lato,helvetica neue,Arial,sans-serif,-apple-system",
  },

  title: {
    textStyle: {
      fontWeight: 'normal',
      color: '#031232',
      fontSize: 16,
    }
  },

  visualMap: {
    color: ['#00a8c6', '#a2d4e6']
  },

  valueAxis: {
    splitLine: {
      lineStyle: {
        type: 'solid',
        color: '#e4e4e4'
      }
    },
    nameTextStyle: {
      fontSize: 12.8,
      color: '#031232',
    },
    axisLabel: {
      color:'#5d5d5d',
      fontSize: 11.7
    }
  },

  scatter : {
    itemStyle:{
      color: '#76ced2cc',
      borderWidth: 1,
      borderColor: 'rgba(6, 29, 86, 0.4)'      
    },
    'emphasis': { 
      itemStyle: {
        opacity:1,
      }
    },
    markLine: {
      itemStyle: {
        lineStyle: {
          type: 'solid',
        }
      }
    }
  },

  toolbox: {
    color: ['#00a8c6', '#00a8c6', '#00a8c6', '#00a8c6']
  },

  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 2,
    padding: 8,
    textStyle: {
      fontSize: 12.8,
    },
    axisPointer: { // Axis indicator, coordinate trigger effective
      type: 'line', // The default is a straight lineï¼š 'line' | 'shadow'
      lineStyle: { // Straight line indicator style settings
        color: '#00a8c6',
        type: 'solid'
      },
      crossStyle: {
        color: '#00a8c6'
      },
      shadowStyle: { // Shadow indicator style settings
        color: 'rgba(200,200,200,0.3)'
      }
    }
  },

  // Area scaling controller
  dataZoom: {
    dataBackgroundColor: '#eee', // Data background color
    fillerColor: 'rgba(144,197,237,0.2)', // Fill the color
    handleColor: '#00a8c6' // Handle color
  },

  timeline: {
    lineStyle: {
      color: '#00a8c6'
    },
    controlStyle: {
      normal: {
        color: '#00a8c6'
      },
      emphasis: {
        color: '#00a8c6'
      }
    }
  },

  k: {
    itemStyle: {
      normal: {
        color: '#40c0cb', // Yang line filled with color
        color0: '#f0dec2', // Yinxian fill color
        lineStyle: {
          width: 1,
          color: '#8fbe00', // Yang line border color
          color0: '#aee239' // Yinbian border color
        }
      }
    }
  },

  candlestick: {
    itemStyle: {
      normal: {
        color: '#00a8c6',
        color0: '#a2d4e6',
        lineStyle: {
          width: 1,
          color: '#00a8c6',
          color0: '#a2d4e6'
        }
      }
    }
  },

  graph: {
    color: colorPalette
  },

  map: {
    itemStyle: {
      normal: {
        areaStyle: {
          color: '#ddd'
        },
        label: {
          textStyle: {
            color: '#c12e34'
          }
        }
      },
      emphasis: { // Is also selected style
        areaStyle: {
          color: '#f0dec2'
        },
        label: {
          textStyle: {
            color: '#c12e34'
          }
        }
      }
    }
  },

};