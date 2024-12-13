import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { ThemeOption } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts/core';
import { HttpClient } from '@angular/common/http';
import { color } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
 

  ngOnInit(): void {
    this.ngOnInit4();
    this.GetFirstData();
    this.Notfi();
    this.initChart2();
    this.  initChart6();
    this.initChart7(); 
    this.createChartOptions();
    this.GetNewData(); 
    this.GetDataNewChart();
    this.GetData20();
  }
  IsLoading = false;


  // options: any;

  // platformId = inject(PLATFORM_ID); 
  constructor(private cd: ChangeDetectorRef,private http: HttpClient,private el: ElementRef,) { }

  data4: any;

  options4: any;

  ngOnInit4() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data4 = {
      datasets: [
        {
          data: [11, 16, 7, 3, 14],
          backgroundColor: [
            documentStyle.getPropertyValue('--red-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--bluegray-500'),
            documentStyle.getPropertyValue('--blue-500')
          ],
          label: 'My dataset'
        }
      ],
      labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue']
    };

    this.options4 = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }


  data3: any
  options3: any;

  GetFirstData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data3 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aout', 'Septembre', 'Octobre', 'Nouvembre', 'Decembre'],
      datasets: [
        {
          label: 'الإيرادات',
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--cyan-600'),
          yAxisID: 'y',
          tension: 0.4,
          data: [0, 0, 80, 81, 56, 55, 10, 90, 40, 14, 80, 33],
          borderColor: documentStyle.getPropertyValue('--cyan-600'),
          borderWidth: 2
        },
        {
          label: 'المصروفات',
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--red-600'),
          yAxisID: 'y1',
          tension: 0.4,
          data: [0, 0, 40, 19, 86, 27, 90, 12, 74, 22, 70, 99],
          borderColor: documentStyle.getPropertyValue('--red-600'),
          borderWidth: 2
        }
      ]
    };

    this.options3 = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            color: textColorSecondary
          },
          grid: {
            drawOnChartArea: false,
            color: surfaceBorder
          }
        }
      }
    };
  }


  data2: any;

  options2: any;

  v1 : any;

  Notfi() {
    const documentStyle = getComputedStyle(document.documentElement);
    

    function hasThemeClass(element: HTMLElement | null, className: string): boolean {
      if (!element) {
        return false; // Base case: if element is null, the class is not found
      }
      return element.classList.contains(className) || hasThemeClass(element.parentElement, className);
    }

    let textColor: string;
    let textColorSecondary: string;
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    if (localStorage.getItem("theme")=="dark-theme") {
      textColor = documentStyle.getPropertyValue('--p-Blue-dev1');
      textColorSecondary = documentStyle.getPropertyValue('--p-Blue-dev1');
    } else {
      textColor = documentStyle.getPropertyValue('--p-text-color');
      textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    }

    
    // const textColor = documentStyle.getPropertyValue('--p-text-color');
    //  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    //  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
 

 
    this.data2 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aout', 'Septembre', 'Octobre', 'Nouvembre', 'Decembre'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--p-green-500'),
          borderColor: documentStyle.getPropertyValue('--p-green-500'),
          data: [0, 0, 80, 81, 56, 55, 40, 80, 14, 50, 30, 0]
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
          borderColor: documentStyle.getPropertyValue('--p-orange-500'),
          data: [0, 0, 40, 19, 86, 27, 90, 60, 10, 70, 69, 30]
        }
      ]
    };

    this.options2 = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {

         


            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }


  data5: any
  options5: any;
  initChart2() {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.data5 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          type: 'line',
          label: 'Dataset 1',
          borderColor: documentStyle.getPropertyValue('--p-orange-500'),
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: [50, 25, 12, 48, 56, 76, 42]
        },
        {
          type: 'bar',
          label: 'Dataset 2',
          backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
          data: [21, 84, 24, 75, 37, 65, 34],
          borderColor: 'white',
          borderWidth: 2
        },
        {
          type: 'bar',
          label: 'Dataset 3',
          backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
          data: [41, 52, 24, 74, 23, 21, 32]
        }
      ]
    };

    this.options5 = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };


  }
  data6: any
  options6: any;
  initChart6() {
 
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');

        this.data6 = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
                }
            ]
        };

        this.options6 = {
            cutout: '70%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
      
}

data7: any
options7: any;
initChart7() {
   
      const documentStyle = getComputedStyle(document.documentElement);
      // const textColor = documentStyle.getPropertyValue('--p-text-color');

      let textColor: string; 

      if (localStorage.getItem("theme")=="dark-theme") {
        textColor = documentStyle.getPropertyValue('--p-neutral-50'); 
      } else {
        textColor = documentStyle.getPropertyValue('--p-text-color'); 
      }


      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');

      this.data7 = {
          labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
          datasets: [
              {
                  label: 'My First dataset',
                  borderColor: documentStyle.getPropertyValue('--p-gray-400'),
                  pointBackgroundColor: documentStyle.getPropertyValue('--p-gray-400'),
                  pointBorderColor: documentStyle.getPropertyValue('--p-gray-400'),
                  pointHoverBackgroundColor: textColor,
                  pointHoverBorderColor: documentStyle.getPropertyValue('--p-gray-400'),
                  data: [65, 59, 90, 81, 56, 55, 40]
              },
              {
                  label: 'My Second dataset',
                  borderColor: documentStyle.getPropertyValue('--p-cyan-400'),
                  pointBackgroundColor: documentStyle.getPropertyValue('--p-cyan-400'),
                  pointBorderColor: documentStyle.getPropertyValue('--p-cyan-400'),
                  pointHoverBackgroundColor: textColor,
                  pointHoverBorderColor: documentStyle.getPropertyValue('--p-cyan-400'),
                  data: [28, 48, 40, 19, 96, 27, 100]
              }
          ]
      };

      this.options7 = {
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              r: {
                  grid: {
                      color: textColorSecondary
                  }
              }
          }
      };
  }
  
 

  
 
  theme: string | ThemeOption = 'dark';
  options11: EChartsCoreOption | null = null;


  createChartOptions(): void {  // void return type
    this.options11 = {
      title: {
        left: '50%',
        text: 'Nightingale Rose Diagram',
        subtext: 'Mocking Data',
        textAlign: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        align: 'auto',
        bottom: 10,
        data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8'],
      },
      calculable: true,
      series: [
        {
          name: 'area',
          type: 'pie',
          radius: [30, 110],
          roseType: 'area',
          data: [
            { value: 10, name: 'rose1' },
            { value: 5, name: 'rose2' },
            { value: 15, name: 'rose3' },
            { value: 25, name: 'rose4' },
            { value: 20, name: 'rose5' },
            { value: 35, name: 'rose6' },
            { value: 30, name: 'rose7' },
            { value: 40, name: 'rose8' },
          ],
        },
      ],
    };
  }


  options12: EChartsCoreOption | null = null;
  GetNewData(){

    const documentStyle = getComputedStyle(document.documentElement); 
    let textColor: string; 

    if (localStorage.getItem("theme")=="dark-theme") {
      textColor = documentStyle.getPropertyValue('--p-neutral-50'); 
    } else {
      textColor = documentStyle.getPropertyValue('--p-text-color'); 
    }
  this.options12 = {
    legend: {
      textStyle: {  // Style the legend labels
        color: textColor,  
        // fontSize: 14,   
        // fontWeight: 'bold', 
      },

    },
    tooltip: {},
    dataset: {
      // Provide a set of data.
      source: [
        ['product', '2015', '2016', '2017'],
        ['Matcha Latte', 43.3, 85.8, 93.7],
        ['Milk Tea', 83.1, 73.4, 55.1],
        ['Cheese Cocoa', 86.4, 65.2, 82.5],
        ['Walnut Brownie', 72.4, 53.9, 39.1],
      ],
    },
    // Declare an x-axis (category axis).
    // The category map the first column in the dataset by default.
    xAxis: { 
      type: 'category',
      axisLabel: {  // Style the x-axis labels
        color: textColor,      // Set the text color
        // fontSize: 16,     
        // fontWeight: 'bold',  
      },
    
    },
    // Declare a y-axis (value axis).
    yAxis: {

      axisLabel: {  // Style the x-axis labels
        color: textColor,      // Set the text color
        // fontSize: 16,     
        // fontWeight: 'bold',  
      },
    },
    // Declare several 'bar' series,
    // every series will auto-map to each column by default.
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
  };
}

  mergeOptions12!: EChartsCoreOption;

  RandomDataset() {
    this.mergeOptions12 = {
      dataset: {
        source: [
          ['product', '2015', '2016', '2017'],
          ['Matcha Latte', ...this.getRandomValues()],
          ['Milk Tea', ...this.getRandomValues()],
          ['Cheese Cocoa', ...this.getRandomValues()],
          ['Walnut Brownie', ...this.getRandomValues()],
        ],
      },
    };
  }

  private getRandomValues() {
    const res: number[] = [];
    for (let i = 0; i < 3; i++) {
      res.push(Math.random() * 100);
    }
    return res;
  }
  isLoading = false;
  options18: EChartsCoreOption | null = null;  
GetDataNewChart(){
  const documentStyle = getComputedStyle(document.documentElement); 
    let textColor: string; 

    if (localStorage.getItem("theme")=="dark-theme") {
      textColor = documentStyle.getPropertyValue('--p-neutral-50'); 
    } else {
      textColor = documentStyle.getPropertyValue('--p-text-color'); 
    }

   this.options18 = {
    
    
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['X-1', 'X-2', 'X-3', 'X-4', 'X-5'],
      textStyle: {  // Style the legend labels
        color: textColor,  
        // fontSize: 14,   
        // fontWeight: 'bold', 
      },
    }, 
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLabel: {  // Style the x-axis labels
          color: textColor,      // Set the text color
          // fontSize: 16,     
          // fontWeight: 'bold',  // Set the font weight
          rotate: 45,        // Rotate labels (if needed) 
        },
        
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {  // Style the x-axis labels
          color: textColor,      // Set the text color
          // fontSize: 16,     
          // fontWeight: 'bold',  
        },
      },
    ],
    series: [
      {
        name: 'X-1',
        type: 'line',
        stack: 'counts',
        areaStyle: {},
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: 'X-2',
        type: 'line',
        stack: 'counts',
        areaStyle: {},
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: 'X-3',
        type: 'line',
        stack: 'counts',
        areaStyle: {},
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: 'X-4',
        type: 'line',
        stack: 'counts',
        areaStyle: {},
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: 'X-5',
        type: 'line',
        stack: 'counts',
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {},
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  };
}


initOpts20:any; 
GetInitOpts(){
  this.initOpts20 = {
    renderer: 'svg',
    width: 300,
    height: 300,
  };
}


options20:EChartsCoreOption  | null = null;  
GetData20(){
  this.GetInitOpts();
  this.options20  = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Counters',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220],
      },
    ],
  };

}


}


