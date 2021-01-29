<template>
  <div class="flex flex-direction serialport">
    <div class="content">
      <p v-for="(item,index) in contents" :key="index">
        [{{item.date}}] 【{{item.type}}】 {{item.value}}
      </p>
    </div>
    <div class="flex-shrink flex footer ">
      <div class="flex-shrink select-left-box">
        <div class="select-item port-box">
          <label for="portNmae" class="select-label">端口号</label>
          <select id="portNmae" class="select" v-model="comNum">
            <option v-for="(item,index) in serialportLists" :key="index" :value="item.comName">{{item.comName}}</option>
          </select>
        </div>
        <div class="select-item baud-box">
          <label for="baudRate" class="select-label">波特率</label>
          <select id="baudRate" class="select" v-model="baudRate">
            <option :value="115200">115200</option>
            <option :value="9600">9600</option>
            <option :value="4800">4800</option>
          </select>
        </div>
        <div class="flex align-center justify-end select-item">
          <button class="pointer open-btn" @click="clearWindow">清空窗口</button>
          <button class="pointer open-btn" @click="openPort" v-if="!isOpen">打开串口</button>
          <button class="pointer open-btn" @click="closePort" v-if="isOpen">关闭串口</button>
        </div>
      </div>
      <div class="flex flex-direction send-message-box">
        <textarea class="" v-model="message"></textarea>
        <div class="flex align-center justify-between send-btn-box">
          <div class="">{{openTip}}</div>
          <button class="pointer send-btn" @click="send">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {formatDate} from '@/utils'
  import Serialport from 'serialport'
  export default {
    name: 'Serialport',
    data () {
      return {
        serialportLists: [],
        comNum: '',
        baudRate: 9600,
        openSerialport: null,
        message: '1234567890',
        isOpen: false,
        openTip: '',
        contents: []
      }
    },
    watch: {
      comNum (val) {
        if (this.isOpen) {
          this.closePort()
        }
      },
      baudRate () {
        if (this.isOpen) {
          this.closePort()
        }
      }
    },
    mounted () {
      Serialport.list().then(
        ports => {
          this.serialportLists = ports
          this.comNum = ports[0].comName
          console.log(ports)
        }
      )
    },
    methods: {
      openPort () {
        this.openSerialport = new Serialport(this.comNum, {
          baudRate: parseInt(this.baudRate),
          dataBits: 8, /* 数据位 */
          parity: 'none', /* 奇偶校验 */
          stopBits: 1, /* 停止位 */
          flowControl: false,
          autoOpen: false /* 设置默认开启 */
        }, false)
        this.openSerialport.open((error) => {
          console.log(error)
          if (error) {
            console.log('failed to open: ' + error)
          } else {
            console.log(this.openSerialport)
            console.log('open')
            this.openTip = `${this.openSerialport.path}:已打开`
            this.isOpen = true
            /* 接收消息 */
            this.openSerialport.on('data', data => {
              this.contents.push({
                value: data.toString(),
                date: formatDate('yyyy-MM-dd hh:mm:ss S'),
                type: '接收'
              })
              console.log(data)
            })
          }
        })
      },
      closePort () {
        this.openSerialport.close(error => {
          if (!error) {
            console.log('close')
            this.openTip = ''
            this.isOpen = false
          }
        })
      },
      send () {
        if (this.isOpen) {
          /* 发送消息 */
          this.openSerialport.write(this.message, (error) => {
            if (!error) {
              console.log('send success')
              this.contents.push({
                value: this.message,
                date: formatDate('yyyy-MM-dd hh:mm:ss S'),
                type: '发送'
              })
            } else {
              console.log('send failed')
            }
          })
        }
      },
      clearWindow () {
        this.contents = []
      }
    }
  }
</script>

<style scoped lang="scss">
  .serialport{
    height: 100%;
  }
  .content{
    height: 100%;
    background-color: #333;
    color: #ffffff;
    padding: 5px 10px;
    overflow: hidden;
    overflow-y: auto;
  }
  .footer{
    height: 150px;
    background-color: #ececec;
    .select-left-box{
      padding: 5px;
      .select-item{
        margin-bottom: 5px;
        .select-label{
          padding: 5px;
        }
        .select{
          width: 200px;
          height: 25px;
        }
      }

      .open-btn{
        height: 30px;
        padding: 0 15px;
        &+.open-btn{
          margin-left: 5px;
        }
      }
    }
    .send-message-box{
      width: 100%;
      padding: 5px;
      textarea{
        width: 100%;
        height: 100%;
        resize: none;
        padding: 5px 8px;
      }
      .send-btn-box{
        margin-top: 5px;
        .send-btn{
          height: 30px;
          padding: 0 15px;
        }
      }
    }
  }
</style>
