<template>
  <div class="alarmcontainer">
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
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="tablebox">
          <h4>站台列表信息</h4>
          <el-table :data="listData1.tableData" border style="width: 100%" height="242">
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
              :total="listData1.totalPages"
            ></el-pagination>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="tablebox">
          <h4>未处理报警信息</h4>
          <el-table :data="listData2.tableData" border style="width: 100%" height="262">
            <el-table-column
              v-for="item in listData2.tableList"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="dealPolice(scope.row, scope.$index)">处理报警</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="list-paging">
            <el-pagination
              @current-change="handleCurrentChange2"
              layout="prev, pager, next"
              :total="listData2.totalPages"
            ></el-pagination>
          </div>
        </el-col>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8" class="a-right">
        <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="24" class="echartsbox" id="echartsbox1"></el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="24" class="echartsbox" id="echartsbox2"></el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="24" class="echartsbox" id="echartsbox3"></el-col>
      </el-col>
    </el-row>
    <el-dialog
      title="处理报警"
      :visible.sync="dialogFormVisible"
      style="min-width: 400px"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="触发报警：" :label-width="formLabelWidth">
          <el-select v-model="dialogForm.staff" placeholder="请选择触发人员信息" @change="changestaff">
            <el-option label="其他" value="-1"></el-option>
            <el-option label="普通职工" value="0"></el-option>
            <el-option label="检票员" value="1"></el-option>
            <el-option label="安检员" value="2"></el-option>
            <el-option label="站内警察" value="3"></el-option>
            <el-option label="乘务员" value="4"></el-option>
            <el-option label="乘警" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-radio-group v-model="dialogForm.notStaff">
            <el-radio :label="6" @change="changenotStaff" :disabled="flag">非工作人员</el-radio>
            <el-radio :label="7" @change="changenotStaff" :disabled="flag">其他</el-radio>
            <el-radio :label="8" @change="changenotStaff" :disabled="flag">误报</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理人员：" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入处理人员信息（最多20字）"
            v-model="dialogForm.dealStaff"
          ></el-input>
        </el-form-item>
        <el-form-item label="处理详情：" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入处理详情（最多120字）"
            v-model="dialogForm.desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="报警图片：" :label-width="formLabelWidth">
          <img :src="dialogForm.picture" alt style="width: 100%" title="点击放大" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOperating">提交处理信息</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Video from "../public/video";
import echarts from "echarts";
import "../../assets/iconfont/iconfont.css";
import { reject } from "q";
import Socket from "../../js/socket";
export default {
  data() {
    return {
      videoData1: {
        videocontainerStyle: {
          width: "502px"
        },
        monitorboxStyle: {
          width: "100%",
          marginLeft: "0",
          marginRight: "0"
        },
        monitorwindowStyle: {
          height: "286px"
        },
        videocontainernum: 1,
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
          width: "502px"
        },
        monitorboxStyle: {
          width: "100%",
          marginLeft: "0",
          marginRight: "0"
        },
        monitorwindowStyle: {
          height: "282px"
        },
        videocontainernum: 2,
        titleFlag: true,
        list: [
          {
            name: "",
            idName: "bb",
            videoUrl: ""
          }
        ]
      },
      paramlist1: {
        page: 1,
        limit: 4,
        sort: "createTime",
        order: "asc"
      },
      paramlist2: {
        page: 1,
        limit: 10,
        sort: "time",
        order: "desc"
      },
      listData1: {
        tableData: [],
        totalPages: 0
      },
      listData2: {
        tableList: [
          // {
          //   label: "序号",
          //   prop: "xuhao"
          // },
          {
            label: "报警站台",
            prop: "stationName"
          },
          {
            label: "站台位置",
            prop: "position"
          },
          {
            label: "报警时间",
            prop: "timeStr"
          }
        ],
        tableData: [],
        totalPages: 0
      },
      dialogForm: {
        staff: "",
        notStaff: "",
        dealStaff: "",
        desc: "",
        warnId: "",
        position: "",
        stationId: "",
        time: "",
        videoUrl: ""
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      flag: false,
      index: "",
      videoServerIp: "",
      websocket: ""
    };
  },
  methods: {
    videochild1() {},
    videochild2() {},
    /**
     * @description: 获取站台列表信息
     * @param {type} 
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
          this.$message({
            type: "info",
            message: "获取站台信息列表失败！"
          });
        });
    },
    /**
     * @description: 未处理报警信息
     * @param {type} 
     * @return: 
     */    
    getwarningList() {
      this.axios
        .get("/codmin/warn/list", {
          params: this.paramlist2
        })
        .then(res => {
          var a = 0;
          res.data.data.records.forEach(item => {
            item.xuhao = a;
            item.position = item.position === 1 ? "上行" : "下行";
            a++;
          });
          this.listData2.tableData = res.data.data.records;
          this.listData2.totalPages = parseInt(res.data.data.total);
        })
        .catch(res => {
          this.$message({
            type: "info",
            message: "未处理报警信息列表失败！"
          });
        });
    },
    /**
     * @description: 今日数据统计
     * @param {type} 
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
          this.$message({
            type: "info",
            message: "获取今日统计数据失败！"
          });
        });
    },
    /**
     * @description: 近七日数据统计
     * @param {type} 
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
          this.echartsSetOptions2(
            document.getElementById("echartsbox2"),
            legendData,
            timeData,
            objData
          );
        })
        .catch(res => {
          this.$message({
            type: "info",
            message: "获取近七日统计数据失败！"
          });
        });
    },
    /**
     * @description: 近一个月数据统计
     * @param {type} 
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
          this.$message({
            type: "info",
            message: "获取近一个月统计数据失败！"
          });
        });
    },
    /**
     * @description: 站台列表信息页码
     * @param {type} 
     * @return: 
     */    
    handleCurrentChange1(val) {
      this.paramlist1.page = val;
      this.getstationListInfo();
    },
    /**
     * @description: 为处理报警信息页码
     * @param {type} 
     * @return: 
     */    
    handleCurrentChange2(val) {
      this.paramlist2.page = val;
      this.getwarningList();
    },
    /**
     * @description: 处理报警
     * @param {type} 
     * @return: 
     */    
    dealPolice(val, index) {
      this.index = index;
      this.dialogFormVisible = true;
      this.dialogForm.staff = "";
      this.dialogForm.notStaff = "";
      this.dialogForm.dealStaff = "";
      this.dialogForm.desc = "";
      this.dialogForm.warnId = val.id;
      this.dialogForm.position = val.position === "上行" ? "1" : "2";
      this.dialogForm.stationId = val.stationId;
      this.dialogForm.time = val.timeStr;
      this.dialogForm.picture = val.picture;
      this.dialogForm.videoUrl = val.videoUrl;
    },
    /**
     * @description: 选择触发报警人员
     * @param {type} 
     * @return: 
     */    
    changestaff(val) {
      if (val === "-1") {
        this.flag = false;
      } else {
        this.flag = true;
        this.dialogForm.notStaff = "";
      }
    },
    /**
     * @description: 选择单选框
     * @param {type} 
     * @return: 
     */    
    changenotStaff(val) {
      this.dialogForm.staff = "-1";
      // if (this.dialogForm.staff === "") {
      //   this.$alert("请选择触发人员信息", "提示", {
      //     confirmButtonText: "确定",
      //     callback: action => {
      //       this.dialogForm.notStaff = "";
      //     }
      //   });
      // }
    },
    /**
     * @description: 提交处理信息功能
     * @param {type} 
     * @return: 
     */    
    dialogOperating() {
      this.axios
        .post("/codmin/warnDealDesc/add", this.dialogForm)
        .then(res => {
          if (res.status === 200) {
            this.$alert("提交成功", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.axios
                  .post("/codmin/warn/changeDealType", {
                    id: this.dialogForm.warnId
                  })
                  .then(res => {
                    this.listData2.tableData.splice(this.index, 1);
                  })
                  .catch(err => {
                    this.$message({
                      type: "warn",
                      message: "处理报警信息失败！"
                    });
                  });
                this.dialogFormVisible = false;
              }
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "warn",
            message: "提交失败！"
          });
        });
    },
    /**
     * @description: 站台列表信息上行摄像头图标点击功能
     * @param {type} 
     * @return: 
     */    
    upCameraClick(val) {
      this.videoData1.list[0].name = `${val.stationName}上行视频显示`;
      this.videoData1.list[0].idName = `aa${Math.floor(Math.random() * 100)}`;
      this.videoData1.list[0].videoUrl = `${this.videoServerIp}/${val.upObj.cameraid}/${val.upObj.cameraid}.m3u8`;
    },
    /**
     * @description: 站台列表信息上行音柱图标点击功能
     * @param {type} 
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
     * @description: 站台列表信息下行摄像头图标点击功能
     * @param {type} 
     * @return: 
     */    
    downCameraClick(val) {
      this.videoData2.list[0].name = `${val.stationName}下行视频显示`;
      this.videoData2.list[0].idName = `bb${Math.floor(Math.random() * 100)}`;
      this.videoData2.list[0].videoUrl = `${this.videoServerIp}/${val.downObj.cameraid}/${val.downObj.cameraid}.m3u8`;
    },
    /**
     * @description: 站台列表信息下行音柱图标点击功能
     * @param {type} 
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
     * @param {type} 
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
     * @param {type} 
     * @return: 
     */    
    echartsSetOptions2(selector, legendData, timeData, objData) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: "近七日数据统计",
          x: "center"
        },
        color: ["#006699", "#4cabce", "#e5323e"],
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
            name: "正常数据",
            type: "bar",
            barGap: 0,
            barWidth: 12,
            data: objData.normalNum
          },
          {
            name: "入侵数据",
            type: "bar",
            barWidth: 12,
            data: objData.warnNum
          },
          {
            name: "误报数据",
            type: "bar",
            barWidth: 12,
            data: objData.wrongNum
          }
        ]
      });
    },
    /**
     * @description: echarts折线图封装
     * @param {type} 
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
     * @description: socket连接
     * @param {type} 
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
     * @param {type} 
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
  mounted() {
    this.getstationListInfo();
    this.getwarningList();
    this.gettodayWarn();
    this.getlastsevenWarn();
    this.getlastmonthWarn();
    this.socket();
  },
  beforeDestroy() {
    this.websocket.ws.close();
  },
  destroyed() {},
  components: { Video }
};
</script>

<style lang="less">
.alarmcontainer {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .el-row {
    width: 100%;
    .a-left {
      max-height: 840px;
      box-sizing: border-box;
      padding: 0 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .el-col {
        margin-bottom: 20px;
      }
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
        height: 50%;
        margin-bottom: 40px;
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
          height: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff;
        }
      }
    }
    .a-right {
      // height: 100%;
      max-height: 800px;
      box-sizing: border-box;
      padding: 0 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: 20px;
      .echartsbox {
        // height: 30%;
        height: 200px;
        background-color: #fff;
        margin-bottom: 50px;
      }
    }
  }
  .el-dialog__wrapper {
    .el-dialog {
      min-width: 400px !important;
    }
  }
}
</style>