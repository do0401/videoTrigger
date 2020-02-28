export default {
	chartOptions: {
		pointsVisible: false,
		width: 270,
		height: 270,
		legend: 'none',
		chartArea: {
			width: 229,
			height: 229,
		},
		hAxis: {
			direction: -1,
			textStyle: {
				color: '#999',
			},
			baselineColor: '#bbbbbb',
			gridlines: { color: '#e3e3e3', minSpacing: 30 },
			ticks: [1.2, 0.9, 0.6, 0.3, 0, -0.3, -0.6, -0.9, -1.2],
		},
		vAxis: {
			textStyle: {
				color: '#999',
			},
			baselineColor: '#bbbbbb',
			gridlines: { color: '#e3e3e3', minSpacing: 30 },
			ticks: [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2],
		},
	},
	chartDataHeader: ['RelSide', 'RelHeight'],
	chartDataRows: [0, 0],
	updatedChartData: [],
}
