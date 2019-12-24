<template>
  <div class="container">
    <div class="filterbox">
      <el-form label-width="120px">
        <el-form-item label="配置名称：">
          <el-input v-model="paramsList.key"></el-input>
        </el-form-item>
        <el-form-item label="配置别名：">
          <el-input v-model="paramsList.alias"></el-input>
        </el-form-item>
        <el-form-item label="属性值：">
          <el-input v-model="paramsList.value"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="conditionSearch">搜索</el-button>
          <el-button @click="formReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <Tablelist :listData="listData" @parent="child"></Tablelist>

    <el-dialog :title="dialog.title" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="配置名称：" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.key" :disabled="dialog.operating === '修改'?true:false"></el-input>
        </el-form-item>
        <el-form-item label="配置别名：" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.alias"></el-input>
        </el-form-item>
        <el-form-item label="属性值：" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOperating(dialog.operating)">{{dialog.operating}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tablelist from "../public/tablelist";
import "../../css/my.less";
export default {
  data() {
    return {
      dialog: {
        title: "",
        operating: ""
      },
      dialogForm: [],
      paramsList: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "asc",
        key: "",
        alias: "",
        value: ""
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
      listData: {
        where: "configmanage",
        title: "配置管理列表",
        isOpration: true,
        operation: ["新增", "删除"],
        tableList: [
          {
            label: "序号",
            prop: "num",
            sort: true
          },
          {
            label: "配置名称",
            prop: "key"
          },
          {
            label: "配置别名",
            prop: "alias"
          },
          {
            label: "属性值",
            prop: "value"
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
  created() {
    this.getConfigList();
  },
  methods: {
    /**
     * @description: 搜索
     * @param {type} 
     * @return: 
     */    
    conditionSearch() {
      this.getConfigList();
    },
    /**
     * @description: 获取配置列表
     * @param {type} 
     * @return: 
     */    
    getConfigList() {
      this.axios
        .get("/codmin/config/list", {
          params: this.paramsList
        })
        .then(res => {
          if (res.status === 200) {
            var a = 0;
            res.data.data.records.forEach(item => {
              item.num = a;
              a++;
            });
            this.listData.tableData = res.data.data.records;
            this.listData.currentPage = parseInt(res.data.data.current);
            this.listData.pages = res.data.data.pages;
            this.listData.total = parseInt(res.data.data.total);
          }
        }).catch(err => {
          this.$message({
            type: "info",
            message: "获取配置管理列表失败！"
          });
        })
    },
    /**
     * @description: 添加/编辑功能
     * @param {type} 
     * @return: 
     */    
    dialogOperating(val) {
      switch (val) {
        case "修改":
          this.axios
            .post(
              "/codmin/config/update/" + this.dialogForm.id,
              this.dialogForm
            )
            .then(res => {
              if (res.status === 200) {
                this.$alert("修改成功", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.getConfigList();
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
          this.dialogFormVisible = false;
          this.axios
            .post("/codmin/config/add", this.dialogForm)
            .then(res => {
              if (res.status === 200) {
                this.$alert("添加成功", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.getConfigList();
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
        limit: 10,
        sort: "createTime",
        order: "asc",
        key: "",
        alias: "",
        value: ""
      };
      this.getConfigList();
    },
    /**
     * @description: 表格操作
     * @param {type} 
     * @return: 
     */    
    child(val) {
      switch (val.identify) {
        case "editor":
          this.dialog.title = "编辑配置";
          this.dialog.operating = "修改";
          this.axios.get("/codmin/config/detail/" + val.data.id).then(res => {
            this.dialogFormVisible = true;
            if (res.status === 200) {
              this.dialogForm = res.data.data;
            } else {
              this.$message({
                type: "info",
                message: "编辑失败"
              });
            }
          });
          break;
        case "add":
          this.dialog.title = "添加配置";
          this.dialog.operating = "添加";
          this.dialogFormVisible = true;
          this.dialogForm = [];
          break;
        case "singleRemove":
          this.$confirm("是否删除该配置?", "提示", {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.axios
                .post("/codmin/config/remove/" + val.data[0])
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
            this.$confirm("请选择配置！", "提示", {
              type: "warning",
              center: true
            });
          } else {
            this.$confirm("是否删除被选中的配置?", "提示", {
              confirmButtonText: "确定删除",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
              .then(() => {
                this.axios
                  .post("/codmin/config/remove-batch", {
                    ids: val.data.selectIdList
                  })
                  .then(res => {
                    if (res.status === 200) {
                      this.$message({
                        type: "success",
                        message: "删除成功!"
                      });
                      // val.data.selectIndexList.forEach(item => {
                      //   this.listData.tableData.splice(item, 1);
                      // });
                      this.getConfigList();
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
        case "page":
          this.paramsList.page = val.data;
          this.getConfigList();
          break;
        case "sizechange":
          this.paramsList.limit = val.data;
          this.getConfigList();
          break;
        default:
      }
    }
  },
  components: { Tablelist }
};
</script>
<style lang="less">
</style>