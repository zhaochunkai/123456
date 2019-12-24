<template>
  <div class="container">
    <div class="filterbox">
      <el-form :model="paramsList" label-width="80px">
        <el-form-item label="站台名：">
          <el-select v-model="paramsList.stationId" placeholder="请选择">
            <el-option
              v-for="item in platformArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理人员： ">
          <el-input v-model="paramsList.dealStaff"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="conditionSearch">搜索</el-button>
          <el-button @click="formReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <Tablelist :listData="listData" @parent="child"></Tablelist>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
      width="56%"
    >
      <div class="recordbox">
        <Video :videoData="videoData1" @videoparent="videochild1"></Video>
      </div>
      <div class="recordinfo">
        <el-form :model="dialogForm" label-width="100px">
          <el-form-item label="站台名称：">
            <el-input v-model="dialogForm.stationName" disabled></el-input>
          </el-form-item>
          <el-form-item label="站台位置：">
            <el-input v-model="dialogForm.position" disabled></el-input>
          </el-form-item>
          <el-form-item label="报警类型：">
            <el-input v-model="dialogForm.classes" disabled></el-input>
          </el-form-item>
          <el-form-item label="警报触发物：">
            <el-input v-model="dialogForm.warnTrigger" disabled></el-input>
          </el-form-item>
          <el-form-item label="处理人员：">
            <el-input v-model="dialogForm.dealStaff" disabled></el-input>
          </el-form-item>
          <el-form-item label="报警时间：">
            <el-input v-model="dialogForm.warnTimeStr" disabled></el-input>
          </el-form-item>
          <el-form-item label="处理时间：">
            <el-input v-model="dialogForm.dealTimeStr" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Video from "../public/video";
import Tablelist from "../public/tablelist";
import "../../css/my.less";
import { resolve, reject } from "q";
export default {
  data() {
    return {
      videoData1: {
        videocontainerStyle: {
          width: "746px"
        },
        monitorboxStyle: {
          width: "100%",
          marginLeft: "0",
          marginRight: "0"
        },
        monitorwindowStyle: {
          height: "420px"
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
      dialogFormVisible: false,
      dialogForm: {},
      dialog: {
        title: "视频记录",
        operating: ""
      },
      formLabelWidth: "120px",
      platformArr: [],
      paramsList: {
        page: 1,
        limit: 10,
        sort: "dealTime",
        order: "desc",
        stationId: "",
        dealStaff: ""
      },
      listData: {
        where: "callpolicelist",
        title: "已处理报警列表",
        isOpration: false,
        operation: [],
        tableList: [
          {
            label: "序号",
            prop: "xuhao",
            sort: true
          },
          {
            label: "站台名称",
            prop: "stationName"
          },
          {
            label: "报警位置",
            prop: "position"
          },
          {
            label: "报警类型",
            prop: "classes"
          },
          {
            label: "警报触发物",
            prop: "warnTrigger"
          },
          {
            label: "处理人员",
            prop: "dealStaff"
          },
          {
            label: "处理时间",
            prop: "dealTimeStr",
            sort: true
          },
          {
            label: "报警时间",
            prop: "warnTimeStr",
            sort: true
          }
        ],
        tableData: [],
        handle: ["视频回放"],
        currentPage: 1,
        pages: 0,
        total: 0
      },
      videoRecordIndex: 1
    };
  },
  methods: {
    videochild1() {},
    /**
     * @description: 搜索
     * @param {type} 
     * @return: 
     */    
    conditionSearch() {
      this.getCallpoliceList();
    },
    /**
     * @description: 获取已处理报警列表
     * @param {type} 
     * @return: 
     */    
    getCallpoliceList() {
      this.axios
        .get("/codmin/warnDealDesc/list", {
          params: this.paramsList
        })
        .then(res => {
          if (res.status === 200) {
            var a = 0;
            res.data.data.records.forEach(item => {
              item.xuhao = a;
              item.position = item.position === 1 ? "上行" : "下行";
              item.classes =
                item.classes === 0
                  ? "正常"
                  : item.classes === 1
                  ? "入侵"
                  : "误报";
              a++;
            });
            this.listData.tableData = res.data.data.records;
            this.listData.currentPage = parseInt(res.data.data.current);
            this.listData.pages = res.data.data.pages;
            this.listData.total = parseInt(res.data.data.total);
          }
        })
        .catch(res => {
          this.$message({
            type: "info",
            message: "获取已处理报警信息列表失败！"
          });
        });
    },
    /**
     * @description: 获取站台列表
     * @param {type} 
     * @return: 
     */    
    getPlatformList() {
      this.axios
        .get("/codmin/station/all")
        .then(res => {
          if (res.status === 200) {
            this.platformArr = res.data.data;
          }
        })
        .catch(res => {
          this.$message({
            type: "info",
            message: "获取站台列表失败！"
          });
        });
    },
    /**
     * @description: 重置
     * @param {type} 
     * @return: 
     */    
    formReset() {
      this.paramsList = {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "asc",
        stationId: "",
        dealStaff: ""
      };
      this.getCallpoliceList();
    },
    /**
     * @description: 表格操作
     * @param {type} 
     * @return: 
     */    
    child(val) {
      switch (val.identify) {
        case "record":
          this.dialogForm = val.data;
          this.dialogFormVisible = true;
          val.data.position1 = val.data.position === "上行" ? "1" : "2";
          return new Promise((resolve, reject) => {
            this.axios
              .post("/codmin/camera/getCameraByStation", {
                position: val.data.position1,
                stationId: val.data.stationId
              })
              .then(res => {
                resolve(res.data.data);
              });
          })
            .then(cameraid => {
              return new Promise((resolve, reject) => {
                let timeArr = val.data.dealTimeStr.split(" ");
                let timestr =
                  timeArr[0].split("-").join("") +
                  timeArr[1].split(":").join("");
                this.axios
                  .get(`/codmin/video/warning/${cameraid}/${timestr}/two`)
                  .then(res => {
                    resolve(res.data.data.url);
                  })
                  .catch(err => {
                    this.$message({
                      type: "info",
                      message: "未拿到视频，请重试"
                    });
                  });
              });
            })
            .then(videoUrl => {
              this.videoData1.list[0].idName = `videorecord${this.videoRecordIndex}`;
              this.videoRecordIndex++;
              this.videoData1.list[0].videoUrl = `${videoUrl}`;
            });
          break;
        case "editor":
          break;
        case "singleRemove":
          this.$confirm("是否删除该鸟类?", "提示", {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.axios
                .post("/birds-server/bird/remove/" + val.data[0])
                .then(res => {
                  if (res.status === 200) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.listData.tableData.splice(val.data[1], 1);
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
          break;
        case "multipleRemove":
          if (!val.data.selectIdList[0]) {
            this.$confirm("请选择鸟类！", "提示", {
              type: "warning",
              center: true
            });
          } else {
            this.$confirm("是否删除被选中的鸟类?", "提示", {
              confirmButtonText: "确定删除",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
              .then(() => {
                this.axios
                  .post("/birds-server/bird/remove-batch", {
                    idList: val.data.selectIdList
                  })
                  .then(res => {
                    if (res.status === 200) {
                      this.$message({
                        type: "success",
                        message: "删除成功!"
                      });
                      val.data.selectIndexList.forEach(item => {
                        this.listData.tableData.splice(item, 1);
                      });
                    } else {
                      this.$message({
                        type: "error",
                        message: "删除失败"
                      });
                    }
                  });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除"
                });
              });
          }
          break;
        case "add":
          break;
        case "page":
          this.paramsList.page = val.data;
          this.getCallpoliceList();
          break;
        case "sizechange":
          this.paramsList.limit = val.data;
          this.getCallpoliceList();
          break;
        default:
      }
    },
  },
  created() {
    this.getCallpoliceList();
    this.getPlatformList();
  },
  mounted() {},
  components: { Tablelist, Video }
};
</script>

<style lang="less">
.container {
  .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__body {
        display: flex;
        justify-content: space-between;
        .recordbox {
          width: 74%;
        }
        .recordinfo {
          width: 26%;
        }
      }
    }
  }
}
</style>