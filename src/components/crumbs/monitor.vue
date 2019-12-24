<template>
  <div class="container">
    <div class="box" ref="box">
      <Video :videoData="videoData1" @videoparent="videochild1"></Video>
    </div>
    <div class="list-paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[4, 6, 9, 12]"
        layout="sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Video from "../public/video";
import { resolve, reject } from "q";
export default {
  data() {
    return {
      videoData1: {
        videocontainerStyle: {
          width: "1340px"
        },
        monitorboxStyle: {
          width: "650px"
        },
        monitorwindowStyle: {
          height: "366px"
        },
        titleFlag: true,
        list: []
      },
      paramlist: {
        page: 1,
        limit: 4,
        sort: "createTime",
        order: "desc"
      },
      cameraArr: [],
      total: 0,
      videoRecordIndex: 0
    };
  },
  methods: {
    videochild1() {},
    /**
     * @description: 获取摄像头列表
     * @param {type} 
     * @return: 
     */    
    getcameraList() {
      return new Promise((resolve, reject) => {
        this.axios
          .get("/codmin/config/videoServerIp")
          .then(res => {
            resolve(res.data.data);
          })
          .catch(err => {
            reject(err);
          });
      }).then(videoServerIp => {
        this.axios
          .get("/codmin/camera/list", {
            params: this.paramlist
          })
          .then(res => {
            this.videoData1.list = [];
            res.data.data.records.forEach(item => {
              let videoObj = {};
              videoObj.name =
                item.cameraPosition === "1"
                  ? item.stationName + "上行视频"
                  : item.stationName + "下行视频";
              videoObj.idName = `camera${this.videoRecordIndex}`;
              videoObj.videoUrl = `${videoServerIp}/${item.id}/${item.id}.m3u8`;
              this.videoRecordIndex++;
              this.videoData1.list.push(videoObj);
            });
            this.total = parseInt(res.data.data.total);
          })
          .catch(err => {
            this.$message({
              type: "info",
              message: "获取摄像头列表失败！"
            });
          });
      });
    },
    /**
     * @description: 每页需要展示的摄像头个数
     * @param {type} 
     * @return: 
     */    
    handleSizeChange(val) {
      this.paramlist.limit = val;
      this.getcameraList();
      switch (val) {
        case 4:
          this.videoData1.videocontainerStyle = {
            width: "1340px"
          };
          this.videoData1.monitorboxStyle = {
            width: "650px"
          };
          this.videoData1.monitorwindowStyle = {
            height: "366px"
          };
          break;
        case 6:
          this.videoData1.videocontainerStyle = {
            width: "1700px"
          };
          this.videoData1.monitorboxStyle = {
            width: "490px"
          };
          this.videoData1.monitorwindowStyle = {
            height: "276px"
          };
          break;
        case 9:
          this.videoData1.videocontainerStyle = {
            width: "1400px"
          };
          this.videoData1.monitorboxStyle = {
            width: "440px"
          };
          this.videoData1.monitorwindowStyle = {
            height: "248px"
          };
          break;
        case 12:
          this.videoData1.videocontainerStyle = {
            width: "1800px"
          };
          this.videoData1.monitorboxStyle = {
            width: "380px"
          };
          this.videoData1.monitorwindowStyle = {
            height: "214px"
          };
          break;
      }
    },
    /**
     * @description: 页码
     * @param {type} 
     * @return: 
     */    
    handleCurrentChange(val) {
      this.paramlist.page = val;
      this.getcameraList();
    }
  },
  created() {
    this.getcameraList();
  },
  mounted() {},
  watch: {},
  components: { Video }
};
</script>

<style lang="less">
.container {
  .box {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .list-paging {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>