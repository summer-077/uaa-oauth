<template>
  <div class="home">
    <div class="box-card">
      <div class="chat">
        <div class="item">开始答题</div>
      </div>
      <div class="dialog_box">
        <div class="chat_record" ref="chat_record">
          <div :class="['chat_item', 'clearfix', item.type?'me':'']" v-for="item,i in chat_list" :key="i">
            <div class="avatar">
              <el-image style="width: 40px; height: 40px" :src="item.avatar"></el-image>
            </div>
            <div class="chat_text">
              <div class="time">{{ item.time }}</div>
              <div class="text">
                <div class="text-con">{{ item.text }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="form">
          <div class="value">
            <el-input v-model="chat" placeholder="请输入内容"></el-input>
          </div>
          <div class="icon">
            <el-button @click="send" type="primary" icon="el-icon-position">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HomeView',
  data() {
    return {
      chat: '',
      chat_list: [
        { type: 1, avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', time: '2022-12-22 12:23:21', text: '你好' },
        { type: 0, avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', time: '2022-12-22 12:23:21', text: '你也好' },
        { type: 1, avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', time: '2022-12-22 12:23:21', text: '哈哈' },
        { type: 0, avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', time: '2022-12-22 12:23:21', text: '嘻放假啊莱克斯顿九分裤啦手机打开发机阿卡手打飞机扩大时开发商京东客服觉得嘻' },
        { type: 1, avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', time: '2022-12-22 12:23:21', text: '九分裤拉数据打开了附件阿萨达发可视对讲饭卡结算单饭卡时间段副科级啊SDK啊斯柯达积分卡束带结发久啊凯撒电极法拉萨电极法' },
        { type: 0, avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', time: '2022-12-22 12:23:21', text: '胡说啥' },
      ]
    }
  },

  methods: {
    send() {
      console.log(this.$refs.chat_record.scrollHeight);
      this.chat_list.push({
        time: '2022-12-12 12:22:32',
        type: 1,
        avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        text: this.chat,
      })

      this.$nextTick(() => {
          // 滚动到底部
          // 使用 $refs 来获取容器元素
          const container = this.$refs.chat_record;
          // 将容器滚动到底部
          container.scrollTop = container.scrollHeight;
        });
    }
  }
}
</script>

<style lang="less" scoped>

.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.home {
  font-family: PingFangSC, PingFang SC;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  .box-card {
    height: 100%;
    border: #EBEBEB 1px solid;
    display: flex;
    .chat {
      box-sizing: border-box;
      width: 240px;
      height: 100%;
      border-right: 1px solid #EBEBEB;
      padding: 20px;
      overflow: auto;
      .item {
        color: #FFF;
        text-align: center;
        padding: 10px;
        margin-bottom: 10px;
        background: #00A0E9;
        border-radius: 4px;
        /* 禁止文字选中 */
        -webkit-user-select: none; /* Chrome、Safari、Opera */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE 10+ */
        user-select: none; /* 标准语法 */

        /* 将鼠标光标修改为小手 */
        cursor: pointer;
      }
    }
    .dialog_box {
      flex: 1;
      position: relative;
      height: 100%;
      overflow: hidden;
      padding-bottom: 100px;
      box-sizing: border-box;
      .chat_record {
        height: 100%;
        overflow: auto;
        padding: 20px;
        .chat_item {
          padding: 20px 0;
          margin: 10px 0;
          .avatar {
            border-radius: 20px;
            overflow: hidden;
            font-size: 0;
            width: 40px;
            height: 40px;
            margin: 10px;
            float: left;
          }
          .chat_text {
            float: left;
            .time {
              color: #ccc;
              padding: 5px 0;
              font-size: 12px;
            }
            .text {
              display: flex;
              .text-con {
                border-radius: 4px;
                padding: 10px;
                background: rgb(244, 246, 248);
              }
            }
          }
        }
        .me {
          .avatar {
            float: right;
          }
          .chat_text {
            float: right;
            .time {
              text-align: right;
            }
            .text {
              display: flex;
              justify-content: flex-end;
              .text-con {
                background: rgb(149, 236, 205);
              }
            }
          }
        }
      }
      .form {
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
        background: #FFF;
        .value {
          flex: 1;
        }
        .icon {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
