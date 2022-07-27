import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'forecast';
  forecastData: any;
  currentData: any;
  dataload: boolean = false;

  chartOptions = {
    animationEnabled: true,
    theme: "light1",
    title: {
      text: ""
    },
    axisX: {
      valueFormatString: "D",
      intervalType: "day",
      interval: 1
    },
    axisY: {
      title: "Temperature",
      suffix: "°C"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e: any) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    data: [{
      type: "spline",
      name: "Temp",
      showInLegend: true,
      yValueFormatString: "#,###°C",
      linewidth: 10,
      lineThickness: 4,
      dataPoints: []
    },
    {
      type: "spline",
      name: "Feel Temp",
      showInLegend: true,
      yValueFormatString: "#,###°C",
      linewidth: 10,
      lineThickness: 4,
      dataPoints: []
    }]
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.dataload = false;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {

        this.http.get<any>('https://api.openweathermap.org/data/2.5/weather?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&appid=b66f1d5e26e1f72d6bd5c9967708c16a').subscribe(data => {
          this.currentData = data;

          this.http.get<any>('https://api.openweathermap.org/data/2.5/forecast?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&appid=b66f1d5e26e1f72d6bd5c9967708c16a').subscribe(data => {
            this.forecastData = data;
            this.displayData(this.currentData, this.forecastData);
          })

        })
      });
    }


  }

  displayData(d1: any, d2: any) {
    this.chartOptions.data[0].dataPoints = [];
    this.chartOptions.data[1].dataPoints = [];
    var cData = d1;
    var fData = d2;

    console.log(cData)
    console.log(fData)
    this.chartOptions.title.text = fData.city.name + " Graph";

    fData.list.forEach(element => {

      var forecastObject = {
        x: new Date(element.dt_txt),
        y: element.main.temp - 273.15
      }
      var feelObject = {
        x: new Date(element.dt_txt),
        y: element.main.feels_like - 273.15
      }
      this.chartOptions.data[0].dataPoints.push(forecastObject);
      this.chartOptions.data[1].dataPoints.push(feelObject);


    });

    this.dataload = true;

  }


}
