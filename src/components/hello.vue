<template>
  <div class="hellocontainer">
    <div class="a-top">
      <h1>端台智能预警管理系统</h1>
      <el-tooltip class="item" effect="dark" :content="content" placement="bottom">
        <span class></span>
        <span class="iconfont icon-yonghu" @click="jump"></span>
      </el-tooltip>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane label="数据统计" name="first">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8" class="a-left">
            <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="24">
              <Video :videoData="videoData1" @videoparent="videochild1"></Video>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="24">
              <Video :videoData="videoData2" @videoparent="videochild2"></Video>
            </el-col>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8" class="a-middle">
            <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="24" class="tablebox">
              <h4>站台列表信息</h4>
              <el-table :data="listData1.tableData" border style="width: 100%" height="276">
                <el-table-column prop="stationName" label="站台名称" align="center"></el-table-column>
                <el-table-column label="上行" align="center">
                  <template slot-scope="scope">
                    <span
                      :class="scope.row.upObj.icons1"
                      style="margin-left:10px"
                      @click="upCameraClick(scope.row)"
                    ></span>
                    <span :class="scope.row.upObj.icons2" style="margin-left:10px"></span>
                    <span
                      :class="scope.row.upObj.icons3"
                      style="margin-left:10px"
                      @click="upSoundClick(scope.row)"
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column label="下行" align="center">
                  <template slot-scope="scope">
                    <span
                      :class="scope.row.downObj.icons1"
                      style="margin-left:10px"
                      @click="downCameraClick(scope.row)"
                    ></span>
                    <span :class="scope.row.downObj.icons2" style="margin-left:10px"></span>
                    <span
                      :class="scope.row.downObj.icons3"
                      style="margin-left:10px"
                      @click="downSoundClick(scope.row)"
                    ></span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="list-paging">
                <el-pagination
                  @current-change="handleCurrentChange1"
                  layout="prev, pager, next"
                  :page-size="4"
                  :total="listData1.totalpages"
                ></el-pagination>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="11"
              :xl="24"
              class="echartsbox"
              id="echartsbox4"
            ></el-col>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8" class="a-right">
            <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="24" class="echartsbox" id="echartsbox1"></el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="24" class="echartsbox" id="echartsbox2"></el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="24" class="echartsbox" id="echartsbox3"></el-col>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="监控显示" name="second">
        <div class="box" ref="box">
          <Video :videoData="videoData3" @videoparent="videochild3"></Video>
        </div>
        <div class="list-paging">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[4, 6, 9, 12]"
            :page-size="100"
            layout="sizes, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>>

<script>
import Video from "./public/video";
import echarts from "echarts";
import "../assets/iconfont/iconfont.css";
import { reject, resolve } from "q";
import Socket from "../js/socket";
export default {
  data() {
    return {
      videoData1: {
        videocontainerStyle: {
          width: "594px"
        },
        monitorboxStyle: {
          width: "100%",
          marginLeft: "0",
          marginRight: "0"
        },
        monitorwindowStyle: {
          height: "336px"
        },
        titleFlag: true,
        list: [
          {
            name: "",
            idName: "aa",
            videoUrl: ""
          }
        ]
      },
      videoData2: {
        videocontainerStyle: {
          width: "594px"
        },
        monitorboxStyle: {
          width: "100%",
          marginLeft: "0",
          marginRight: "0"
        },
        monitorwindowStyle: {
          height: "336px"
        },
        titleFlag: true,
        list: [
          {
            name: "",
            idName: "bb",
            videoUrl: ""
          }
        ]
      },
      videoData3: {
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
      paramlist1: {
        page: 1,
        limit: 4,
        sort: "createTime",
        order: "asc"
      },
      paramlist2: {
        page: 1,
        limit: 4,
        sort: "createTime",
        order: "desc"
      },
      listData1: {
        tableData: [],
        totalpages: 0
      },
      flag: false,
      index: "",
      content: "亲，请登录",
      activeName: "first",
      cameraArr: [],
      total: 0,
      videoServerIp: "",
      cameraIndex: 1,
      websocket: ""
    };
  },
  methods: {
    videochild1() {},
    videochild2() {},
    videochild3() {},
    /**
     * @description: 站台列表信息
     * @param
     * @return:
     */

    getstationListInfo() {
      this.axios
        .post("/codmin/station/stationListInfo", this.paramlist1)
        .then(res => {
          res.data.data.records.forEach(item => {
            let upObj = {
              icons1: "",
              icons2: "",
              icons3: "",
              cameraid: "",
              soundid: "",
              radarid: ""
            };
            let downObj = {
              icons1: "",
              icons2: "",
              icons3: "",
              cameraid: "",
              soundid: "",
              radarid: ""
            };
            item.cameras.forEach(cameraitem => {
              switch (cameraitem.cameraPosition) {
                case "1":
                  upObj.cameraid = cameraitem.id;
                  upObj.icons1 = `iconfont icon-shexiangtou1 cameraitem${cameraitem.id}`;
                  break;
                case "2":
                  downObj.cameraid = cameraitem.id;
                  downObj.icons1 = `iconfont icon-shexiangtou1 cameraitem${cameraitem.id}`;
                  break;
              }
            });
            item.radars.forEach(radaritem => {
              switch (radaritem.position) {
                case 1:
                  upObj.icons2 = `iconfont icon--radar`;
                  break;
                case 2:
                  downObj.icons2 = `iconfont icon--radar`;
                  break;
              }
            });
            item.sounds.forEach(sounditem => {
              switch (sounditem.position) {
                case 1:
                  upObj.icons3 = `iconfont icon-mobile`;
                  break;
                case 2:
                  downObj.icons3 = `iconfont icon-mobile`;
                  break;
              }
            });
            item.upObj = upObj;
            item.downObj = downObj;
          });
          this.listData1.tableData = res.data.data.records;
          this.listData1.totalpages = parseInt(res.data.data.total);
          this.videoData1.list[0].videoUrl = `${res.data.data.records[0].videoServerIp}/${res.data.data.records[0].upObj.cameraid}/${res.data.data.records[0].upObj.cameraid}.m3u8`;
          this.videoData2.list[0].videoUrl = `${res.data.data.records[0].videoServerIp}/${res.data.data.records[0].downObj.cameraid}/${res.data.data.records[0].downObj.cameraid}.m3u8`;
          this.videoServerIp = res.data.data.records[0].videoServerIp;
          this.videoData1.list[0].name = `${res.data.data.records[0].stationName}上行视频显示`;
          this.videoData2.list[0].name = `${res.data.data.records[0].stationName}下行视频显示`;
        })
        .catch(err => {
          reject(err);
        });
    },
    /**
     * @description: 今日各站台数据统计
     * @param
     * @return:
     */

    getstationInfo() {
      this.axios
        .post("/codmin/warn/todayWarnByStation")
        .then(res => {
          var legendData = ["待处理数据", "入侵数据", "误报数据"];
          var xData = res.data.data.stationNameList;
          var objData = {
            normalNum: res.data.data.todayNotDealNumList,
            warnNum: res.data.data.todayWarnNumList,
            wrongNum: res.data.data.todayWrongNumList
          };
          var title = "今日各站台数据统计";
          var colorArr = ["#006699", "#4cabce", "#e5323e"];
          this.echartsSetOptions24(
            title,
            colorArr,
            document.getElementById("echartsbox4"),
            legendData,
            xData,
            objData
          );
        })
        .catch(res => {
          console.log(res);
        });
    },
    /**
     * @description: 今日数据统计
     * @param
     * @return:
     */

    gettodayWarn() {
      this.axios
        .post("/codmin/warn/todayWarn")
        .then(res => {
          var legendData = ["入侵数据", "误报数据", "待处理数据"];
          var detailData = [
            { value: res.data.data.todayWarnNum, name: "入侵数据" },
            { value: res.data.data.todayWrongNum, name: "误报数据" },
            { value: res.data.data.todayNotDealNum, name: "待处理数据" }
          ];
          this.echartsSetOptions1(
            document.getElementById("echartsbox1"),
            legendData,
            detailData
          );
        })
        .catch(res => {
          console.log(res);
        });
    },
    /**
     * @description: 近七日数据统计
     * @param
     * @return:
     */

    getlastsevenWarn() {
      this.axios
        .post("/codmin/warn/lastSevenWarn")
        .then(res => {
          var legendData = ["正常数据", "入侵数据", "误报数据"];
          var timeData = res.data.data.date;
          var objData = {
            normalNum: res.data.data.normalNum,
            warnNum: res.data.data.warnNum,
            wrongNum: res.data.data.wrongNum
          };
          var title = "近七日数据统计";
          var colorArr = ["#006699", "#4cabce", "#e5323e"];
          this.echartsSetOptions24(
            title,
            colorArr,
            document.getElementById("echartsbox2"),
            legendData,
            timeData,
            objData
          );
        })
        .catch(res => {
          console.log(res);
        });
    },
    /**
     * @description: 近一个月数据统计
     * @param
     * @return:
     */

    getlastmonthWarn() {
      this.axios
        .post("/codmin/warn/lastMonthWarn")
        .then(res => {
          var legendData = ["总数据", "正常数据", "入侵数据", "误报数据"];
          var timeData = res.data.data.date;
          var objData = {
            totalNum: res.data.data.totalNum,
            normalNum: res.data.data.normalNum,
            warnNum: res.data.data.warnNum,
            wrongNum: res.data.data.wrongNum
          };
          this.echartsSetOptions3(
            document.getElementById("echartsbox3"),
            legendData,
            timeData,
            objData
          );
        })
        .catch(res => {
          console.log(res);
        });
    },
    /**
     * @description: 站台列表信息页码切换
     * @param
     * @return:
     */

    handleCurrentChange1(val) {
      this.paramlist1.page = val;
      this.getstationListInfo();
    },
    /**
     * @description: 站台列表信息上行摄像头点击事件
     * @param
     * @return:
     */

    upCameraClick(val) {
      this.videoData1.list[0].name = `${val.stationName}上行视频显示`;
      this.videoData1.list[0].idName = `aa${Math.floor(Math.random() * 100)}`;
      this.videoData1.list[0].videoUrl = `${this.videoServerIp}/${val.upObj.cameraid}/${val.upObj.cameraid}.m3u8`;
    },
    /**
     * @description: 站台列表信息上行音柱点击事件
     * @param
     * @return:
     */

    upSoundClick(val) {
      this.axios
        .post("/codmin/sound/play", { id: val.upObj.soundid })
        .then(res => {
          console.log(res);
        });
    },
    /**
     * @description: 站台列表信息下行摄像头点击事件
     * @param
     * @return:
     */

    downCameraClick(val) {
      this.videoData2.list[0].name = `${val.stationName}下行视频显示`;
      this.videoData2.list[0].idName = `bb${Math.floor(Math.random() * 100)}`;
      this.videoData2.list[0].videoUrl = `${this.videoServerIp}/${val.downObj.cameraid}/${val.downObj.cameraid}.m3u8`;
    },
    /**
     * @description: 站台列表信息下行音柱点击事件
     * @param
     * @return:
     */

    downSoundClick(val) {
      this.axios
        .post("/codmin/sound/play", { id: val.downObj.soundid })
        .then(res => {
          console.log(res);
        });
    },
    /**
     * @description: echarts饼图封装
     * @param
     * @return:
     */

    echartsSetOptions1(selector, legendData, detailData) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: "今日数据统计",
          x: "center"
        },
        color: ["#006699", "#4cabce", "#e5323e"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: legendData
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: detailData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    /**
     * @description: echarts直方图封装
     * @param
     * @return:
     */

    echartsSetOptions24(
      title,
      colorArr,
      selector,
      legendData,
      timeData,
      objData
    ) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: title,
          x: "center"
        },
        color: colorArr,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          orient: "vertical",
          x: "right",
          data: legendData
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: timeData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: legendData[0],
            type: "bar",
            barGap: 0,
            barWidth: 12,
            data: objData.normalNum
          },
          {
            name: legendData[1],
            type: "bar",
            barWidth: 12,
            data: objData.warnNum
          },
          {
            name: legendData[2],
            type: "bar",
            barWidth: 12,
            data: objData.wrongNum
          }
        ]
      });
    },
    /**
     * @description: echarts折线图封装
     * @param
     * @return:
     */

    echartsSetOptions3(selector, legendData, timeData, objData) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: "近一个月数据统计",
          x: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          x: "center",
          y: 30,
          data: legendData
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: timeData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "总数据",
            type: "line",
            stack: "总量",
            data: objData.totalNum
          },
          {
            name: "正常数据",
            type: "line",
            stack: "总量",
            data: objData.normalNum
          },
          {
            name: "入侵数据",
            type: "line",
            stack: "总量",
            data: objData.warnNum
          },
          {
            name: "误报数据",
            type: "line",
            stack: "总量",
            data: objData.wrongNum
          }
        ]
      });
    },
    /**
     * @description: 判断token是否存在
     * @param
     * @return:
     */

    jump() {
      if (localStorage.token) {
        this.$router.push({ path: "/monitor" });
      } else {
        this.$router.push({ path: "/login" });
      }
    },
    /**
     * @description: 获取摄像头列表
     * @param
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
            params: this.paramlist2
          })
          .then(res => {
            this.videoData3.list = [];
            res.data.data.records.forEach(item => {
              let videoObj = {};
              videoObj.name =
                item.cameraPosition === "1"
                  ? item.stationName + "上行视频"
                  : item.stationName + "下行视频";
              videoObj.idName = `camera${this.cameraIndex}`;
              videoObj.videoUrl = `${videoServerIp}/${item.id}/${item.id}.m3u8`;
              this.cameraIndex++;
              this.videoData3.list.push(videoObj);
            });
            this.total = parseInt(res.data.data.total);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    /**
     * @description: 设置每页摄像头个数
     * @param
     * @return:
     */

    handleSizeChange(val) {
      this.paramlist2.limit = val;
      this.getcameraList();
      switch (val) {
        case 4:
          this.videoData3.videocontainerStyle = {
            width: "1340px"
          };
          this.videoData3.monitorboxStyle = {
            width: "650px"
          };
          this.videoData3.monitorwindowStyle = {
            height: "366px"
          };
          break;
        case 6:
          this.videoData3.videocontainerStyle = {
            width: "1700px"
          };
          this.videoData3.monitorboxStyle = {
            width: "540px"
          };
          this.videoData3.monitorwindowStyle = {
            height: "304px"
          };
          break;
        case 9:
          this.videoData3.videocontainerStyle = {
            width: "1400px"
          };
          this.videoData3.monitorboxStyle = {
            width: "440px"
          };
          this.videoData3.monitorwindowStyle = {
            height: "248px"
          };
          break;
        case 12:
          this.videoData3.videocontainerStyle = {
            width: "1800px"
          };
          this.videoData3.monitorboxStyle = {
            width: "426px"
          };
          this.videoData3.monitorwindowStyle = {
            height: "240px"
          };
          break;
      }
    },
    /**
     * @description: 摄像头页码
     * @param
     * @return:
     */

    handleCurrentChange(val) {
      this.paramlist2.page = val;
      this.getcameraList();
    },
    /**
     * @description: socket链接
     * @param
     * @return:
     */

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
          if (msg.type === "warn") {
            return;
          }
          this.dealWebsocketData(msg.data);
        });
      });
    },
    /**
     * @description: socket数据处理
     * @param
     * @return:
     */

    dealWebsocketData(socketData) {
      Object.keys(socketData).forEach(item => {
        if (socketData[item]) {
          document.getElementsByClassName(`cameraitem${item}`)[0].style.color =
            "green";
          return;
        }
        document.getElementsByClassName(`cameraitem${item}`)[0].style.color =
          "red";
      });
    }
  },
  created() {
    this.getstationListInfo();
    this.getstationInfo();
    this.gettodayWarn();
    this.getlastsevenWarn();
    this.getlastmonthWarn();
  },
  mounted() {
    this.getcameraList();
    this.socket();
    this.content = sessionStorage.getItem("user") || "亲，请登录";
  },
  beforeDestroy() {
    //页面关闭时关闭socket
    this.websocket.ws.close();
  },
  destroyed() {},
  components: { Video },
  watch: {}
};
</script>

<style lang="less">
.hellocontainer {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .a-top {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .item {
      position: absolute;
      top: 40px;
      right: 10%;
      cursor: pointer;
    }
  }
  .el-tabs {
    width: 100%;
    .el-tabs__header {
      width: 100%;
      .el-tabs__nav-wrap {
        width: 100%;
        .el-tabs__nav-scroll {
          width: 100%;
          display: flex;
          justify-content: center;
        }
      }
    }
    .el-tabs__content {
      width: 100%;
      .el-tab-pane {
        width: 100%;
        .el-row {
          width: 100%;
          .a-left {
            max-height: 840px;
            box-sizing: border-box;
            padding: 0 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
          }
          .a-middle {
            max-height: 800px;
            box-sizing: border-box;
            padding: 0 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: 20px;
            .tablebox {
              h4 {
                height: 40px;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #fff;
              }
              .list-paging {
                width: 100%;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #fff;
                margin-bottom: 20px;
              }
            }
            .echartsbox {
              height: 380px;
              background-color: #fff;
            }
          }
          .a-right {
            height: 800px;
            box-sizing: border-box;
            padding: 0 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: 20px;
            .echartsbox {
              height: 30%;
              background-color: #fff;
            }
          }
        }
        .box {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .list-paging {
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>