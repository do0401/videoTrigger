<template>
	<div>
		<v-container grid-list-xs>
			<v-row>
				<v-col cols="12" md="1">
					<v-text-field v-model="startPoint" label="시작"></v-text-field>
				</v-col>
				<v-col cols="12" md="1">
					<v-text-field v-model="endPoint" label="종료"></v-text-field>
				</v-col>
				<v-col cols="12" md="3">
					<v-text-field v-model="contents" label="내용"></v-text-field>
				</v-col>
				<v-col cols="12" md="1">
					<v-btn @click="addTextTrack" style="top: 10px;">Add Track</v-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col class="d-flex flex-column" cols="12" md="2">
					<v-row
						><v-btn class="mb-3" @click="generateTrack" style="top: 10px;"
							>Generate</v-btn
						></v-row
					>
					<v-row
						><v-btn
							class="mb-3"
							@click="goBeginOfCurrentTrack"
							style="top: 10px;"
							>Begin Of Current</v-btn
						></v-row
					>
					<v-row
						><v-btn class="mb-3" @click="goPrevTrack" style="top: 10px;"
							>Previous</v-btn
						></v-row
					>
					<v-row
						><v-btn @click="goNextTrack" style="top: 10px;">Next</v-btn></v-row
					>
				</v-col>
				<v-col cols="12" md="7">
					<!-- <video
						id="video"
						controls
						src="../assets/video/testVideo.mp4"
						width="630"
						@loadedmetadata="getVideoInfo"
					></video> -->
					<video
						id="video"
						class="selected_video"
						controls
						width="630"
						@loadedmetadata="getVideoInfo"
					></video>
					<!-- <v-file-input
						v-model="videoFile"
						class="fileInput"
						accept="video/*"
						label="File input"
						@change="getFileData"
					></v-file-input> -->
					<input type="file" @change="getFileData" />
					<!-- <video-player
						class="video-player-box video4 default-align"
						ref="videoPlayer"
						:options="playerOptions"
						:playsinline="true"
					></video-player> -->
				</v-col>
				<v-col cols="12" md="3">
					<GChart
						type="ScatterChart"
						:data="chartData"
						:options="chartOptions"
					></GChart>
				</v-col>
			</v-row>
			<v-row>
				<v-textarea
					id="output"
					:value="this.outputVal"
					rows="10"
					style="max-width: 630px;"
					height="300"
				></v-textarea>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import data from '../assets/data/pa_video_sampledata_200226_2'
import { mapState } from 'vuex'
import { GChart } from 'vue-google-charts'
// import Hls from 'hls.js'
// import HlsjsDnaWrapper from '@streamroot/hlsjs-dna-wrapper'

export default {
	name: 'defult-page',
	components: {
		GChart,
	},
	data: () => ({
		startPoint: 0,
		endPoint: 5,
		contents: '내용을 입력하세요.',
		video: {
			duration: null,
			track: null,
		},
		trackTimeline: [],
		currentTime: 0,
		currentTrack: null,
		prevTrackTime: null,
		nextTrackTime: null,
		outputVal: null,
		relPoint: [0, 0],
		videoFile: null,
		vURL: null,
		// playerOptions: {
		// 	src: require('../assets/video/hugeVideo.mp4'),
		// },
	}),
	mounted() {
		this.drawElement()
		this.vURL = window.URL || window.webkitURL
		// this.test()
	},
	computed: {
		...mapState([
			'chartOptions',
			'chartDataHeader',
			'updatedChartData',
			'chartPointsVisible',
		]),
		chartData() {
			return [this.chartDataHeader, this.updatedChartData]
		},
	},
	created() {
		this.$store.commit('updateData', this.relPoint)
		const buf1 = Buffer.alloc(2147483647)
		const buf2 = Buffer.alloc(2147483647)
	},
	watch: {
		currentTrack: function(v) {
			// currentTrack 변경 시 이전 트랙 time과 다음 트랙 time도 변경
			const parsedData = JSON.parse(v.text)
			const currentTrackPitchNo = parsedData.PitchNo
			let prevTrack = null
			let nextTrack = null
			if (currentTrackPitchNo !== '1') {
				prevTrack = data.filter(function(entry) {
					return entry.PitchNo === String(parseInt(currentTrackPitchNo, 10) - 1)
				})
			}
			if (currentTrackPitchNo !== String(data.length + 1)) {
				nextTrack = data.filter(function(entry) {
					return entry.PitchNo === String(parseInt(currentTrackPitchNo, 10) + 1)
				})
			}
		},
	},
	methods: {
		// test() {
		// 	const video = document.getElementById('video')
		// 	const hlsjsConfig = {
		// 		maxBufferSize: 0,
		// 		maxBufferLength: 30,
		// 		liveSyncDuration: 30,
		// 		liveMaxLatencyDuration: Infinity,
		// 	}
		// 	const dnaConfig = {
		// 		property: 'Live',
		// 		fragmentsFetchedBeforeLoad: 3,
		// 	}
		// 	const hls = new Hls(hlsjsConfig)
		// 	const warapper = new HlsjsDnaWrapper(hls, 'aaa', dnaConfig)
		// 	hls.loadSource(require('../assets/video/hugeVideo.mp4'))
		// 	hls.attachMedia(video)
		// 	hls.on(HlsjsDnaWrapper.Events.MANIFEST_PARSED, function() {
		// 		video.play()
		// 	})
		// },
		getFileData(e) {
			console.log(e)
			const file = e.target.files[0]
			const type = file.type
			const videoNode = document.querySelector('.selected_video')
			const canPlay = videoNode.canPlayType(type)
			if (canPlay === '') canPlay = 'no'
			const isError = canPlay === 'no'
			if (isError) {
				return
			}
			console.log(file)
			const fileURL = this.vURL.createObjectURL(file)
			console.log(fileURL)
			videoNode.src = fileURL
		},
		generateTrack() {
			console.log('Generating Start')
			const videoEl = document.getElementById('video')

			data.forEach(track => {
				this.video.track.addCue(
					new VTTCue(
						track.time_from_offset_adj,
						track.time_from_offset_end,
						JSON.stringify(track),
					),
				)
			})
		},
		goBeginOfCurrentTrack() {
			console.log('go begin of current track')
			const videoEl = document.getElementById('video')
			let skipTimeVal = 0
			this.trackTimeline.some((time, idx) => {
				if (this.currentTime < time) {
					videoEl.currentTime = skipTimeVal
					return true
				}
				skipTimeVal = time
			})
		},
		goPrevTrack() {
			console.log('go prev track')
			const videoEl = document.getElementById('video')
			let skipTimeVal = 0
			let prevTimeVal = 0
			this.trackTimeline.some((time, idx) => {
				if (this.currentTime < time) {
					videoEl.currentTime = skipTimeVal
					return true
				}
				skipTimeVal = prevTimeVal
				prevTimeVal = time
			})
		},
		goNextTrack() {
			console.log('go next track')
			const videoEl = document.getElementById('video')
			let skipTimeVal = 0
			this.trackTimeline.some((time, idx) => {
				skipTimeVal = time
				if (this.currentTime < time) {
					videoEl.currentTime = skipTimeVal
					return true
				}
			})
		},

		getVideoInfo() {
			const videoEl = document.getElementById('video')
			console.log('metadata loaded!')
			this.video.duration = videoEl.duration
			this.video.track = videoEl.addTextTrack('metadata')

			// data에 track endpoint time 추가
			let preTrackEndTime = null
			data.reverse()
			data.forEach(track => {
				// track timeline 생성
				this.trackTimeline.push(parseInt(track.time_from_offset_adj, 10))
				if (preTrackEndTime === null) {
					track.time_from_offset_end = String(
						Number(track.time_from_offset_adj) + 10,
					)
				} else {
					track.time_from_offset_end = preTrackEndTime
				}
				preTrackEndTime = String(Number(track.time_from_offset_adj) - 1)
			})
			data.reverse()
			this.trackTimeline.reverse()
		},

		addTextTrack() {
			console.log('addTextTrack')
			const videoEl = document.getElementById('video')
			this.video.track.addCue(
				new VTTCue(this.startPoint, this.endPoint, this.contents),
			)
		},

		drawElement() {
			console.log('drawElement')
			const videoEl = document.getElementById('video')
			videoEl.addEventListener('play', () => {
				console.log('play')
				const trackList = videoEl.textTracks
				const listLength = trackList.length
				// for (let i = 0; i < listLength; i++) {
				// 	const element = array[i]
				// }
			})

			videoEl.addEventListener('timeupdate', e => {
				console.log('playing')
				const activeCue = e.target.textTracks[0].activeCues
				const output = document.getElementById('output')
				const currentTime = e.target.currentTime

				this.currentTime = currentTime

				if (activeCue && activeCue[0]) {
					const RELHEIGHT = Number(JSON.parse(activeCue[0].text).RelHeight)
					const RELSIDE = Number(JSON.parse(activeCue[0].text).RelSide)
					this.outputVal = `${activeCue[0].text}`
					this.currentTrack = activeCue[0]

					this.chartData[1][0] = RELSIDE
					this.chartData[1][1] = RELHEIGHT
					this.$store.commit('updateData', [RELSIDE, RELHEIGHT])
					this.$store.commit('chartPointsVisible', true)
				} else {
					this.outputVal = ''
					this.currentTrack = null
					this.chartOptions.pointsVisible = false
				}
			})
		},
	},
}
</script>
