<template>
  <div class="container">
    <div class="filterbox">
      <el-form label-width="140px">
        <el-form-item label="音柱编码： ">
          <el-input v-model="paramsList.num"></el-input>
        </el-form-item>
        <el-form-item label="音柱IP： ">
          <el-input v-model="paramsList.ip"></el-input>
        </el-form-item>
        <el-form-item label="音柱所属站台：">
          <el-select v-model="paramsList.stationId" placeholder="请选择">
            <el-option
              v-for="item in platformArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="音柱所属方向：">
          <el-select v-model="paramsList.position" placeholder="所有">
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
      <el-form :model="dialogForm" :rules="dialogFormRules" ref="dialogForm">
        <el-form-item label="音柱编码" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.num" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="音柱IP" :label-width="formLabelWidth" prop="ip">
          <el-input
            v-model="dialogForm.ip"
            auto-complete="off"
            @blur="verifyIp(dialogForm.ip, dialogForm.id)"
          ></el-input>
        </el-form-item>
        <el-form-item label="音柱所属站台" :label-width="formLabelWidth">
          <el-select v-model="dialogForm.stationId" placeholder="请选择站台">
            <el-option
              v-for="item in platformArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="音柱所处方向" :label-width="formLabelWidth">
          <el-select v-model="dialogForm.position" placeholder="请选择">
            <el-option label="上行" value="1"></el-option>
            <el-option label="下行" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogOperating(dialog.operating, 'dialogForm')"
        >{{dialog.operating}}</el-button>
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
      dialogFormRules: {
        ip: [
          { required: true, message: "请输入音柱ip", trigger: "blur" },
          {
            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            message: "请输入合理的ip地址，如：192.168.6.93"
          }
        ]
      },
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
        position: "",
        stationId: "",
        num: "",
        ip: ""
      },
      listData: {
        where: "loudspeaker",
        title: "音柱列表",
        isOpration: true,
        operation: ["新增", "删除"],
        tableList: [
          {
            label: "序号",
            prop: "xuhao",
            sort: true
          },
          {
            label: "音柱编码",
            prop: "num"
          },
          {
            label: "音柱IP",
            prop: "ip"
          },
          {
            label: "音柱所属站台",
            prop: "stationName"
          },
          {
            label: "音柱所处方向",
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
      this.getloudspeakerList();
    },
    /**
     * @description: 获取音柱列表
     * @param {type} 
     * @return: 
     */    
    getloudspeakerList() {
      this.axios
        .get("/codmin/sound/list", {
          params: this.paramsList
        })
        .then(res => {
          if (res.status === 200) {
            var a = 0;
            res.data.data.records.forEach(item => {
              item.xuhao = a;
              item.position = item.position === 1 ? "上行" : "下行";
              a++;
            });
            this.listData.tableData = res.data.data.records;
            this.listData.currentPage = parseInt(res.data.data.current);
            this.listData.pages = res.data.data.pages;
            this.listData.total = parseInt(res.data.data.total);
          } else {
            this.$message({
            type: "info",
            message: "获取音柱信息列表失败！"
          });
          }
        })
        .catch(res => {
          console.log(res);
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
     * @description: 新增/编辑功能
     * @param {type} 
     * @return: 
     */    
    dialogOperating(val, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (val) {
            case "修改":
              this.axios
                .post(
                  "/codmin/sound/update/" + this.dialogForm.id,
                  this.dialogForm
                )
                .then(res => {
                  if (res.status === 200) {
                    this.$alert("修改成功", "提示", {
                      confirmButtonText: "确定",
                      callback: action => {
                        this.getloudspeakerList();
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
                .post("/codmin/sound/add", this.dialogForm)
                .then(res => {
                  if (res.status === 200) {
                    this.$alert("添加成功", "提示", {
                      confirmButtonText: "确定",
                      callback: action => {
                        this.getloudspeakerList();
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
              // }
              // })
              // .catch(res => {
              //   this.$alert("此数据已存在", "提示", {
              //     confirmButtonText: "确定",
              //     callback: action => {
              //       this.dialogFormVisible = false;
              //     }
              //   });
              // });
              break;
          }
        } else {
          this.$alert("请正确输入信息", "提示", {
            confirmButtonText: "确定"
          });
          return false;
        }
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
        position: "",
        stationId: ""
      };
      this.getloudspeakerList();
    },
    /**
     * @description: 表格操作(编辑/单个删除/多个删除/添加/页码/条数)
     * @param {type} 
     * @return: 
     */    
    child(val) {
      switch (val.identify) {
        case "editor":
          this.dialog.title = "编辑音柱";
          this.dialog.operating = "修改";
          this.axios.get("/codmin/sound/detail/" + val.data.id).then(res => {
            this.dialogFormVisible = true;
            if (res.status === 200) {
              res.data.data.position = res.data.data.position === 1 ? "1" : "2";
              this.dialogForm = res.data.data;
            } else {
              this.$message({
                type: "info",
                message: "编辑失败"
              });
            }
          });
          break;
        case "singleRemove":
          this.$confirm("是否删除该音柱?", "提示", {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.axios
                .post("/codmin/sound/remove/" + val.data[0])
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
            this.$confirm("请选择音柱！", "提示", {
              type: "warning",
              center: true
            });
          } else {
            this.$confirm("是否删除被选中的音柱?", "提示", {
              confirmButtonText: "确定删除",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
              .then(() => {
                this.axios
                  .post("/codmin/sound/remove-batch", {
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
                      this.getloudspeakerList()
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
          this.dialog.title = "添加音柱";
          this.dialog.operating = "添加";
          this.dialogFormVisible = true;
          this.dialogForm = {};
          break;
        case "page":
          this.paramsList.page = val.data;
          this.getloudspeakerList();
          break;
        case "sizechange":
          this.paramsList.limit = val.data;
          this.getloudspeakerList();
          break;
        default:
      }
    },
    /**
     * @description: 验证编码是否可用
     * @param {type} 
     * @return: 
     */    
    verifynum(num, id) {
      this.axios
        .post("/codmin/sound/check-unique", {
          id: id,
          num: num
        })
        .then(res => {
          if (res.status === 200) {
            if (res.data.data === false) {
              this.$message({
                type: "warning",
                message: "此编码不可用!"
              });
            }
          }
        });
    },
    /**
     * @description: 验证ip是否可用
     * @param {type} 
     * @return: 
     */    
    verifyIp(ip, id) {
      this.axios
        .get("/codmin/public/ip-is-only", { params: { id: id, ip: ip } })
        .then(res => {
          if (res.status === 200) {
            if (res.data.data === false) {
              this.$message({
                type: "warning",
                message: "此ip不可用!"
              });
              this.dialogForm.ip = "";
            }
          }
        });
    }
  },
  created() {
    this.getloudspeakerList();
    this.getPlatformList();
  },
  mounted() {},
  components: { Tablelist }
};
</script>

<style lang="less">
</style>