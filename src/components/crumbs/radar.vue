<template>
  <div class="container">
    <div class="filterbox">
      <el-form ref="form" :model="paramsList" label-width="140px">
        <el-form-item label="雷达编码： ">
          <el-input v-model="paramsList.num"></el-input>
        </el-form-item>
        <el-form-item label="端口号： ">
          <el-input v-model="paramsList.port"></el-input>
        </el-form-item>
        <el-form-item label="雷达所属站台：">
          <el-select v-model="paramsList.stationId" placeholder="请选择所属站台">
            <el-option
              v-for="item in platformArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="雷达所属方向：">
          <el-select v-model="paramsList.position" placeholder="请选择方向">
            <el-option label="上行" value="1"></el-option>
            <el-option label="下行" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="conditionSearch">搜索</el-button>
          <el-button @click="formReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <Tablelist :listData="listData" @parent="child"></Tablelist>

    <el-dialog :title="dialog.title" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="dialogForm">
        <el-form-item
          label="雷达编码"
          :label-width="formLabelWidth"
          :rules="[
      { required: true}]"
        >
          <el-input v-model="dialogForm.num" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="雷达端口" :label-width="formLabelWidth" :rules="[ { required: true}]">
          <el-input v-model="dialogForm.port" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属站台" :label-width="formLabelWidth" :rules="[{ required: true}]">
          <el-select v-model="dialogForm.stationId" placeholder="请选择所属站台">
            <el-option
              v-for="item in platformArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属方向" :label-width="formLabelWidth" :rules="[{ required: true}]">
          <el-select v-model="dialogForm.position" placeholder="请选择方向">
            <el-option label="上行" value="1"></el-option>
            <el-option label="下行" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOperating(dialog.operating)">{{dialog.operating}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>>

<script>
import Tablelist from "../public/tablelist";
import "../../css/my.less";
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogForm: {},
      dialog: {
        title: "",
        operating: ""
      },
      platformArr: [],
      formLabelWidth: "120px",
      paramsList: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "asc",
        num: "",
        port: "",
        stationId: "",
        position: ""
      },
      listData: {
        where: "radar",
        title: "雷达列表",
        isOpration: true,
        operation: ["新增", "删除"],
        tableList: [
          {
            label: "序号",
            prop: "xuhao",
            sort: true
          },
          {
            label: "雷达编码",
            prop: "num"
          },
          {
            label: "雷达端口",
            prop: "port"
          },
          {
            label: "雷达所属站台",
            prop: "stationName"
          },
          {
            label: "雷达所处方向",
            prop: "position"
          }
        ],
        tableData: [],
        handle: ["编辑", "删除"],
        currentPage: 1,
        pages: 0,
        total: 0
      }
    };
  },
  methods: {
    /**
     * @description: 搜索
     * @param {type} 
     * @return: 
     */    
    conditionSearch() {
      this.getradarList();
    },
    /**
     * @description: 获取雷达列表
     * @param {type} 
     * @return: 
     */    
    getradarList() {
      this.axios
        .get("/codmin/radar/list", {
          params: this.paramsList
        })
        .then(res => {
          if (res.status === 200) {
            let index = 0;
            res.data.data.records.forEach(item => {
              item.position = item.position === 1 ? "上行" : "下行";
              item.xuhao = index;
              index++;
            });
            this.listData.tableData = res.data.data.records;
            this.listData.currentPage = parseInt(res.data.data.current);
            this.listData.pages = parseInt(res.data.data.pages);
            this.listData.total = parseInt(res.data.data.total);
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "获取雷达列表出错！"
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
          console.log(res);
        });
    },
    /**
     * @description: 新增/编辑功能
     * @param {type} 
     * @return: 
     */    
    dialogOperating(val) {
      switch (val) {
        case "修改":
          this.axios
            .post("/codmin/radar/update/" + this.dialogForm.id, this.dialogForm)
            .then(res => {
              if (res.status === 200) {
                this.$alert("修改成功", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.getradarList();
                    this.dialogFormVisible = false;
                  }
                });
              }
            })
            .catch(res => {
              this.$alert("修改失败", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.dialogFormVisible = false;
                }
              });
            });
          break;
        case "添加":
          this.axios
            .post("/codmin/radar/add", this.dialogForm)
            .then(res => {
              if (res.status === 200) {
                this.$alert("添加成功", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.dialogFormVisible = false;
                    this.getradarList();
                  }
                });
              }
            })
            .catch(res => {
              this.$alert("添加失败", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.dialogFormVisible = false;
                }
              });
            });
          break;
      }
    },
    /**
     * @description: 重置
     * @param {type} 
     * @return: 
     */    
    formReset() {
      this.paramsList = {
        page: 1,
        pageSize: 10,
        sort: "createTime",
        order: "asc",
        nameZh: "",
        nameUs: "",
        categoryId: "",
        categoryClassId: ""
      };
      this.getBidsList();
    },
    /**
     * @description: 表格操作(编辑/单个删除/多个删除/添加/页码/条数)
     * @param {type} 
     * @return: 
     */    
    child(val) {
      switch (val.identify) {
        case "editor":
          this.dialog.title = "编辑雷达";
          this.dialog.operating = "修改";
          this.axios
            .get("/codmin/radar/detail/" + val.data.id)
            .then(res => {
              if (res.status === 200) {
                this.dialogForm = res.data.data;
                this.dialogFormVisible = true;
              }
            })
            .catch(err => {
              this.$message({
                type: "info",
                message: "获取详情失败"
              });
            });
          break;
        case "singleRemove":
          this.$confirm("是否删除该雷达?", "提示", {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.axios
                .post("/codmin/radar/remove/" + val.data[0])
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
            this.$confirm("请选择雷达！", "提示", {
              type: "warning",
              center: true
            });
          } else {
            this.$confirm("是否删除被选中的雷达?", "提示", {
              confirmButtonText: "确定删除",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
              .then(() => {
                this.axios
                  .post("/codmin/radar/remove-batch", {
                    ids: val.data.selectIdList
                  })
                  .then(res => {
                    if (res.status === 200) {
                      this.$message({
                        type: "success",
                        message: "删除成功!"
                      });
                      this.getradarList();
                    }
                  })
                  .catch(err => {
                    this.$message({
                      type: "error",
                      message: "删除失败"
                    });
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
          this.dialog.title = "添加雷达";
          this.dialog.operating = "添加";
          this.dialogFormVisible = true;
          this.dialogForm = {};
          break;
        case "page":
          this.paramsList.page = val.data;
          this.getradarList();
          break;
        case "sizechange":
          this.paramsList.limit = val.data;
          this.getradarList();
          break;
        default:
      }
    }
  },
  created() {
    this.getradarList();
    this.getPlatformList();
  },
  mounted() {},
  components: { Tablelist }
};
</script>

<style lang="less">
</style>