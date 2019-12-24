<template>
  <div class="container">
    <div class="menu" ref="menu">
      <el-row class="tac">
        <el-col :span="24">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isCollapse"
            :unique-opened="isOpened"
          >
            <el-submenu v-for="item in menus" :key="item.id" :index="item.id">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.label}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="node in item.children"
                  :key="node.id"
                  :index="node.id"
                  @click="routerJump(item, node.label, node.path)"
                >{{node.label}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>

    <div class="main" ref="main">
      <div class="main-top" ref="mainTop">
        <div class="spread">
          <span class="iconfont icon-shouqianniuicon" @click="isSpread"></span>
        </div>
        <div class="title">端台智能预警管理系统</div>
        <div class="information">
          <div class="info-account">
            <el-dropdown placement="bottom-start" @command="handleCommand">
              <span class="el-dropdown-link">
                <img src="../assets/main/account.png" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="main-middle">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>{{breadcrumb.label}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main-bottom">
        <router-view />
        <div class="systeminfo">成都胜维四通科技有限公司copyright@2019</div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/iconfont/iconfont.css";
export default {
  data() {
    return {
      menus: [
        {
          label: "主页",
          icon: "iconfont icon-shouye",
          id: "1",
          children: [
            {
              label: "监控中心",
              path: "/monitor",
              id: "55"
            }
          ]
        },
        {
          label: "设备管理",
          icon: "iconfont icon-jiankong",
          id: "2",
          children: [
            {
              label: "雷达管理",
              path: "/radar",
              id: "561"
            },
            {
              label: "音柱管理",
              path: "/loudspeaker",
              id: "562"
            },
            {
              label: "摄像头管理",
              path: "/camera",
              id: "563"
            },
            {
              label: "LED管理",
              path: "/led",
              id: "564"
            }
          ]
        },
        {
          label: "报警管理",
          icon: "iconfont icon-caigoutong1108",
          id: "3",
          children: [
            {
              label: "报警处理",
              path: "/alarmprocessing",
              icon: "iconfont icon-leimu",
              id: "11"
            },
            {
              label: "已处理报警列表",
              path: "/callpolicelist",
              icon: "iconfont icon-iconfront-",
              id: "10"
            }
          ]
        },
        {
          label: "站台管理",
          icon: "iconfont icon-shebei",
          id: "9",
          children: [
            {
              label: "站台信息",
              path: "/platforminfo",
              icon: "iconfont icon-shexiangtou",
              id: "13"
            }
          ]
        },
        {
          label: "系统配置",
          icon: "iconfont icon-set",
          id: "7",
          children: [
            {
              label: "配置管理",
              path: "/configmanage",
              id: "30"
            }
          ]
        },
        {
          label: "系统管理",
          icon: "iconfont icon-xitongguanli",
          id: "4",
          children: [
            {
              label: "菜单管理",
              path: "/menumanage",
              icon: "",
              id: "17"
            }
          ]
        }
      ],
      breadcrumbArr: [],
      breadcrumb: {
        label: ""
      },
      isCollapse: false,
      isOpened: true
    };
  },
  methods: {
    /**
     * @description: 菜单导航
     * @param {type} 
     * @return: 
     */    
    handleNodeClick(data) {
      if (!data.children) {
        this.currentLocation = data.label;
        this.$router.push({ path: data.path });
      }
    },
    /**
     * @description: 用户图标功能
     * @param {type} 
     * @return: 
     */    
    handleCommand(command) {
      switch (command) {
        case "退出登录":
          this.$router.push({ path: "/" });
          sessionStorage.removeItem("routerPaths");
          sessionStorage.removeItem("user");
          localStorage.removeItem("token");
          break;
      }
    },
    /**
     * @description: 结合方法'isSpread'封装的动画效果
     * @param {type} 
     * @return: 
     */    
    aaa(point, w, t) {
      point.$refs.menu.style.width = w + "px";
      point.$refs.menu.style.transitionDuration = t + "s";
      point.$refs.main.style.marginLeft = w + "px";
      point.$refs.main.style.transitionDuration = t + "s";
      point.$refs.mainTop.style.paddingLeft = w + "px";
      point.$refs.mainTop.style.transitionDuration = t + "s";
    },
    /**
     * @description: 菜单隐藏/展开功能封装
     * @param {type} 
     * @return: 
     */    
    isSpread() {
      let _this = this;
      switch (this.isCollapse) {
        case false:
          setTimeout(function() {
            _this.aaa(_this, 77, 0.5);
          }, 300);
          _this.isCollapse = true;
          break;
        default:
          _this.aaa(_this, 210, 0.5);
          _this.isCollapse = false;
          break;
      }
    },
    /**
     * @description: 当前页面所在位置
     * @param {type} 
     * @return: 
     */    
    routerJump(item, label, path) {
      let pointPath = `${item.label}>>${label}`;
      this.breadcrumb.label = pointPath;
      this.$router.push({ path: path });
      sessionStorage.setItem("routerPaths", pointPath);
    }
  },
  created() {},
  mounted() {
    //页面刷新时判断浏览器宽度
    this.breadcrumb.label = sessionStorage.getItem('routerPaths')
    let _this = this;
    if (window.innerWidth <= 1024) {
      setTimeout(function() {
        _this.aaa(_this, 77, 0.5);
      }, 300);
      _this.isCollapse = true;
    } else {
      _this.aaa(_this, 210, 0.5);
      _this.isCollapse = false;
    }
    window.onresize = function() {
      if (window.innerWidth <= 1024) {
        setTimeout(function() {
          _this.aaa(_this, 77, 0.5);
        }, 300);
        _this.isCollapse = true;
      } else {
        _this.aaa(_this, 210, 0.5);
        _this.isCollapse = false;
      }
    };
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.container {
  width: 100%;
  overflow: hidden;
  position: relative;
  .menu {
    width: 210px;
    height: 100%;
    background-color: #545c64;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    .tac {
      .el-col {
        .el-menu {
          border: 0;
          width: 100%;
          .el-menu-item {
            width: 100%;
          }
        }
      }
      ul {
        li {
          min-width: 0;
        }
      }
    }
  }
  .main {
    width: 100%;
    margin-left: 210px;
    .main-top {
      width: 100%;
      height: 60px;
      display: flex;
      background-color: #fff;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      box-shadow: 0px 5px 5px #f3eeee;
      box-sizing: border-box;
      padding-left: 210px;
      .spread {
        width: 10%;
        min-width: 80px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          cursor: pointer;
        }
        span:hover {
          color: #ccc;
        }
      }
      .title {
        width: 24%;
        min-width: 422px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: 700;
      }
      .information {
        width: 76%;
        height: 100%;
        display: flex;
        .info-account {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .el-dropdown {
            width: 30px;
            margin-right: 200px;
            cursor: pointer;
          }
          img {
            width: 100%;
          }
        }
      }
    }
    .main-middle {
      box-sizing: border-box;
      margin: 80px 2% 0 2%;
      padding-left: 20px;
      font-size: 14px;
      font-family: "STHeiti";
      font-weight: 700;
      color: #fff;
    }
    .main-bottom {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 2% 40px 2%;
      .systeminfo {
        font-size: 14px;
        position: fixed;
        bottom: 10px;
        right: 2%;
      }
    }
  }
}
// .active {
//   color: #ffd04b !important;
// }
</style>
