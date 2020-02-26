<template>
	<div>
		<v-container grid-list-xs>
			<v-row>
				<v-col cols="12" sm="1">
					<v-text-field v-model="startPoint" label="시작"></v-text-field>
				</v-col>
				<v-col cols="12" sm="1">
					<v-text-field v-model="endPoint" label="종료"></v-text-field>
				</v-col>
				<v-col cols="12" sm="3">
					<v-text-field v-model="contents" label="내용"></v-text-field>
				</v-col>
				<v-col cols="12" sm="1">
					<v-btn @click="addTextTrack" style="top: 10px;">Add Track</v-btn>
				</v-col>
			</v-row>
			<v-row>
				<!-- <video
					id="video"
					src="../assets/SampleVideo_1280x720_30mb.mp4"
					controls
					width="630"
					@loadedmetadata="getVideoInfo"
				></video> -->
				<video
					id="video"
					src="https://cuts.diamond.milb.com/Homebase/2020/2020-02/04/333a4bae-1997005b-4c4ab625-csvm-diamondx64-asset_640x360_29_960K.mp4"
					controls
					width="630"
					@loadedmetadata="getVideoInfo"
				></video>
				<!-- <video
					id="video"
					src="https://play-tv.kakao.com/embed/player/cliplink/406524676?service=daum_sports"
					controls
					width="630"
					@loadedmetadata="getVideoInfo"
				></video> -->
				<!-- <iframe
					title="우리흥의 완벽한 계획! 팀을 승리로 이끄는 리그 9호골! / 후반 45+4분"
					id="video"
					width="640"
					height="360"
					src="https://play-tv.kakao.com/embed/player/cliplink/406524676?service=daum_sports"
					allowfullscreen
					frameborder="0"
					scrolling="no"
					@loadedmetadata="getVideoInfo"
					allow="autoplay"
				></iframe> -->
			</v-row>
			<v-row>
				<v-textarea
					id="output"
					:value="this.outputVal"
					rows="1"
					style="max-width: 630px;"
					disabled
				></v-textarea>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	name: 'defult-page',
	components: {},
	data: () => ({
		startPoint: 0,
		endPoint: 5,
		contents: '내용을 입력하세요.',
		video: {
			duration: null,
			track: null,
		},
		outputVal: null,
	}),
	mounted() {
		this.drawElement()
	},
	computed: {},
	methods: {
		addTextTrack() {
			console.log('addTextTrack')
			const videoEl = document.getElementById('video')
			this.video.track.addCue(
				new VTTCue(this.startPoint, this.endPoint, this.contents),
			)
			console.log(this.video.track)
		},

		getVideoInfo() {
			const videoEl = document.getElementById('video')
			console.log('metadata loaded!')
			console.log(videoEl.duration)
			this.video.duration = videoEl.duration
			this.video.track = videoEl.addTextTrack('metadata')
		},

		drawElement() {
			console.log('drawElement')
			const videoEl = document.getElementById('video')
			console.log(videoEl.duration)
			videoEl.addEventListener('play', () => {
				console.log('play')
				const trackList = videoEl.textTracks
				const listLength = trackList.length
				console.log(trackList)
				console.log(listLength)
				// for (let i = 0; i < listLength; i++) {
				// 	const element = array[i]
				// }
			})

			videoEl.addEventListener('timeupdate', e => {
				console.log('playing')
				const activeCue = e.target.textTracks[0].activeCues
				const output = document.getElementById('output')
				console.log(activeCue)
				activeCue[0]
					? (this.outputVal = `${activeCue[0].text}`)
					: (this.outputVal = '')
			})
		},
	},
}
</script>
