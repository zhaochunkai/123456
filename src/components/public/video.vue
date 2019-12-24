<template>
  <div class="videocontainer" :style="videoData.videocontainerStyle">
    <div
      class="monitorbox"
      :style="videoData.monitorboxStyle"
      v-for="item in videoData.list"
      :key="item.idName"
    >
      <h4 v-if="videoData.titleFlag">{{item.name}}</h4>
      <div class="monitorwindow" :style="videoData.monitorwindowStyle">
        <video
          :id="item.idName"
          class="video-js vjs-default-skin"
          controls
          preload="auto"
          autoplay="true"
        >
          <source :src="item.videoUrl" type="application/x-mpegURL" />
        </video>
      </div>
    </div>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import "videojs-contrib-hls";
import videojs from "video.js";
export default {
  data() {
    return {
      idNames: []
    };
  },
  methods: {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {
    //页面销毁时销毁video
    this.idNames.forEach(item => {
      videojs(item).dispose();
    });
    this.idNames = [];
  },
  watch: {
    /**
     * @description: 监听videoData的值并处理
     * @param {type}
     * @return:
     */

    videoData: {
      deep: true,
      handler(newValue, oldValue) {
        newValue.list.forEach(item => {
          if (!this.idNames.includes(item.idName)) {
            this.idNames.push(item.idName);
            this.$nextTick(() => {
              videojs(
                item.idName,
                {
                  bigPlayButton: false,
                  textTrackDisplay: true,
                  posterImage: true,
                  errorDisplay: true,
                  controlBar: true,
                  autoplay: true
                },
                function() {
                  this.play();
                }
              );
            });
          }
        });
      }
    }
  },
  props: ["videoData"]
};
</script>

<style lang="less">
.videocontainer {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  .monitorbox {
    margin: 0 10px 20px;
    h4 {
      height: 40px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
    }
    .monitorwindow {
      width: 100%;
      .video-js {
        width: 100%;
        height: 100%;
      }
    }
  }
  .monitorbox:hover {
    box-shadow: 2px 2px 10px #949090;
  }
}
</style>