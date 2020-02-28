export default {
	updateData(state, payload) {
		// state.updatedChartData = state.chartDataRows.map(row => {
		// 	return row.map((item, index) => {
		// 		if (index !== 0) {
		// 			const max = item + 1000
		// 			const min = 0
		// 			return Math.floor(Math.random() * (max - min)) + min
		// 		}
		// 		return item
		// 	})
		// })

		state.updatedChartData = payload
	},
	chartPointsVisible(state, payload) {
		state.chartOptions.pointsVisible = payload
	},
}
