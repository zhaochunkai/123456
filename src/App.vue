<template>
  <div id="app">
    <router-view />
    <div class="dialogbox">
      <el-dialog
        title="2/3站台上行视频"
        :visible.sync="dialogFormVisible1"
        :close-on-click-modal="false"
        @close="dialogFormVisible1 = false"
      >
        <div class="invadebox">
          <Video :videoData="videoData1" @videoparent="videochild1"></Video>
        </div>
      </el-dialog>
      <el-dialog title="入侵警报" :visible.sync="dialogFormVisible2" :close-on-click-modal="false">
        <div id="invadeinfo">
          <div class="invade-left">
            <img :src="webSocketData.picture" alt="警报图片" />
          </div>
          <div class="invade-right">
            <p>
              <strong>站台号：</strong>
              {{webSocketData.stationName}}
            </p>
            <p>
              <strong>抓取时间：</strong>
              {{webSocketData.time | formatDate}}
            </p>
            <p>
              <strong>详情请移步最新预警信息！</strong>
            </p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">关 闭</el-button>
          <el-button type="primary" @click="dialogFormVisible2 = false">确 认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Video from "./components/public/video";
import Socket from "./js/socket";
import { resolve, reject } from "q";
export default {
  data() {
    return {
      videoData1: {
        videocontainerStyle: {
          width: "800px"
        },
        monitorboxStyle: {
          width: "100%",
          marginLeft: "0",
          marginRight: "0"
        },
        monitorwindowStyle: {
          height: "450px"
        },
        titleFlag: false,
        list: [
          {
            name: "",
            idName: "",
            videoUrl: ""
          }
        ]
      },
      wsUrl: "",
      ws: {},
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      webSocketData: {
        picture: "",
        stationName: "",
        time: ""
      },
      videoSocketIndex: 1,
      websocket: ""
    };
  },
  methods: {
    videochild1() {},
    socket() {
      return new Promise((resolve, reject) => {
        this.axios.post("/codmin/websocket/websocketIp").then(res => {
          if (res.status === 200) {
            resolve(res.data.data);
          }
        });
      }).then(socketIp => {
        let websocket = new Socket(`ws://${socketIp}:8082/warning`);
        this.websocket = websocket;
        websocket.wsInit();
        websocket.wsGetMessage(msg => {
          if (msg.type === "status") {
            return;
          }
          this.dealWebsocketData(msg.data);
        });
      });
    },
    dealWebsocketData(socketData) {
      this.dialogFormVisible1 = true;
      this.dialogFormVisible2 = true;
      this.webSocketData.picture = socketData.picture;
      this.webSocketData.time = socketData.createTime;
      return new Promise((resolve, reject) => {
        this.axios
          .post("/codmin/station/getNameById", { id: socketData.stationId })
          .then(res => {
            this.webSocketData.stationName =
              socketData.position === 1
                ? res.data.data + "上行视频"
                : res.data.data + "下行视频";
            resolve();
          });
      }).then(() => {
        return new Promise((resolve, reject) => {
          this.axios
            .post("/codmin/camera/getUrlByStation", {
              position: socketData.position,
              stationId: socketData.stationId
            })
            .then(res => {
              this.videoData1.list[0].idName = `videosocket${this.videoSocketIndex}`;
              this.videoSocketIndex++;
              this.videoData1.list[0].videoUrl = `${res.data.data}/${
                res.data.data.split("/").reverse()[0]
              }.m3u8`;
              // document.getElementById(`camera${res.data.data.split("/").reverse()[0]}`).style.border = "10px solid red"
            });
        });
      });
    }
  },
  created() {},
  mounted() {
    this.socket();
  },
  beforeDestroy() {
    this.websocket.ws.close();
  },
  destroyed() {},
  components: { Video },
  filters: {
    formatDate: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  }
};
</script>

<style lang="less">
body {
  background-color: #eee;
}
.dialogbox {
  width: 100%;
  .el-dialog__wrapper:nth-child(1) {
    .el-dialog {
      width: 840px !important;
    }
  }
  .el-dialog__wrapper:nth-child(2) {
    .el-dialog {
      width: 40%;
      min-width: 400px;
      .el-dialog__body {
        #invadeinfo {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .invade-left {
            width: 50%;
            min-width: 320px;
            img {
              width: 100%;
            }
          }
          .invade-right {
            width: 44%;
            min-width: 320px;
            p {
              line-height: 40px;
              font-size: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
