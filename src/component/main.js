/**
 * Day 1
 * A stop watch
 */
'use strict';

import React,{ Component, PropTypes } from 'react';
import { Platform,ListView,StyleSheet,StatusBar,Text,TouchableHighlight,View } from 'react-native';
import Util from './utils';

class WatchFace extends Component{
  static PropTypes = {
    sectionTime: PropTypes.string.isRequired,
    totalTime: PropTypes.string.isRequired
  };

  render(){
    return (
      <View style={styles.watchFaceContainer}>
        <Text style={styles.sectionTime}>{this.props.sectionTime}</Text>
        <Text style={styles.totalTime}>{this.props.totalTime}</Text>
      </View>
    )
  }
}

class WatchController extends Component{
  static PropTypes = {
    startWatch: PropTypes.func.isRequired,
    stopWatch: PropTypes.func.isRequired,
    clearRecord: PropTypes.func.isRequired,
    addRecord: PropTypes.func.isRequired,
  };

  constructor(props){
    super(props);
    this.state = {
      watchOn: false,
      startBtnText: "启动",
      startBtnColor: "#60B644",
      stopBtnText: "计次",
      underlayColor:"#fff"
    }
  }
  
  _startWatch = () => {
    if(!this.state.watchOn){
      this.props.startWatch();
      this.setState({
        watchOn: true,
        startBtnText: "停止",
        startBtnColor: "#ff0044",
        stopBtnText: "计次", 
        underlayColor:"#eee"   
      })
    }else{
      this.props.stopWatch();
      this.setState({
        watchOn: false,
        startBtnText: "启动",
        startBtnColor: "#60B644",
        stopBtnText: "复位",   
        underlayColor:"#eee"
      })
    }
  }

  _addRecord = () => {
    if(!this.state.watchOn){
      this.props.clearRecord();
      this.setState({
        stopBtnText: "计次",
        underlayColor:"#fff"
      })
    }else{
      this.props.addRecord();
    }
  }

  render(){
    return (
      <View style={styles.watchControllerContainer}>
        <View style={{flex:1, alignItems: "flex-start"}}>
          <TouchableHighlight style={styles.btnStart} underlayColor={this.state.underlayColor} onPress={this._addRecord}>
            <Text>{this.state.stopBtnText}</Text>
          </TouchableHighlight>
        </View>
        <View style={{flex: 1, alignItems: "flex-end"}}>
          <TouchableHighlight style={styles.btnStop} underlayColor={this.state.underlayColor} onPress={this._startWatch}>
            <Text style={{color: this.state.startBtnColor}}>{this.state.startBtnText}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

class WatchRecord extends Component{
  render(){
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=> r1 !== r2}),
        theDataSource = ds.cloneWithRows(this.props.record);
    return (
      <ListView
        style={styles.recordList}
        dataSource = {theDataSource}
        renderRow = {(rowData) => 
          <View style={styles.listItem}>
            <View style={{flex:1, alignItems: "center"}}>
              <Text style={styles.listItemTitle}>{rowData.title}</Text>
            </View>
            <View style={{flex:1, alignItems:"center"}}>
              <Text style={styles.listItemTime}>{rowData.time}</Text>
            </View>
          </View>
        }
      />
    )
  }
}

export default class extends Component{
  constructor() {
    super();
      this.state = {
        stopWatch: false,
        resetWatch: true,
        intialTime: 0,
        currentTime:0,
        recordTime:0,
        timeAccumulation:0,
        totalTime: "00:00.00",
        sectionTime: "00:00.00",
        recordCounter: 0,
        record:[
          {title:"",time:""},
          {title:"",time:""},
          {title:"",time:""},
          {title:"",time:""},
          {title:"",time:""},
          {title:"",time:""},
          {title:"",time:""}
        ],
    };
  }

  componentWillUnmount() {
    this._stopWatch();
    this._clearRecord();
  }

  componentDidMount() {
    if(Platform.OS === "ios"){
      StatusBar.setBarStyle(0);
    }
  }

  _startWatch() {
    if (this.state.resetWatch) {
      this.setState({
        stopWatch: false,
        resetWatch: false,
        timeAccumulation:0,
        initialTime: (new Date()).getTime()
      })
    }else{
      this.setState({
        stopWatch: false,
        initialTime: (new Date()).getTime()
      })
    }
    let milSecond, second, minute, countingTime, secmilSecond, secsecond, secminute, seccountingTime;
    let interval = setInterval(
        () => { 
          this.setState({
            currentTime: (new Date()).getTime()
          })
          countingTime = this.state.timeAccumulation + this.state.currentTime - this.state.initialTime;
          minute = Math.floor(countingTime/(60*1000));
          second = Math.floor((countingTime-6000*minute)/1000);
          milSecond = Math.floor((countingTime%1000)/10);
          seccountingTime = countingTime - this.state.recordTime;
          secminute = Math.floor(seccountingTime/(60*1000));
          secsecond = Math.floor((seccountingTime-6000*secminute)/1000);
          secmilSecond = Math.floor((seccountingTime%1000)/10);
          this.setState({
            totalTime: (minute<10? "0"+minute:minute)+":"+(second<10? "0"+second:second)+"."+(milSecond<10? "0"+milSecond:milSecond),
            sectionTime: (secminute<10? "0"+secminute:secminute)+":"+(secsecond<10? "0"+secsecond:secsecond)+"."+(secmilSecond<10? "0"+secmilSecond:secmilSecond),
          })
          if (this.state.stopWatch) {
            this.setState({
              timeAccumulation: countingTime 
            })
            clearInterval(interval)
          };
        },10);
  }

  _stopWatch() {
    this.setState({
      stopWatch: true
    })
  }

  _addRecord() {
    let {recordCounter, record} = this.state;
    recordCounter++;
    if (recordCounter<8) {
      record.pop();
    }
    record.unshift({title:"计次"+recordCounter,time:this.state.sectionTime});
    this.setState({
      recordTime: this.state.timeAccumulation + this.state.currentTime - this.state.initialTime,
      recordCounter: recordCounter,
      record: record
    })
    //use refs to call functions within other sub component
    //can force to update the states
    // this.refs.record._updateData();
  }

  _clearRecord() {
    this.setState({
      stopWatch: false,
      resetWatch: true,
      intialTime: 0,
      currentTime:0,
      recordTime:0,
      timeAccumulation:0,
      totalTime: "00:00.00",
      sectionTime: "00:00.00",
      recordCounter: 0,
      record:[
        {title:"",time:""},
        {title:"",time:""},
        {title:"",time:""},
        {title:"",time:""},
        {title:"",time:""},
        {title:"",time:""},
        {title:"",time:""}
      ],
     });
  }

  render(){
    return (
      <View>
        <WatchFace totalTime={this.state.totalTime} sectionTime={this.state.sectionTime}/>
        <WatchController addRecord={()=>this._addRecord()} clearRecord={()=>this._clearRecord()} startWatch={()=>this._startWatch()} stopWatch={()=>this._stopWatch()}/>
        <WatchRecord record={this.state.record}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  watchFaceContainer: {
    width: Util.size.width,
    paddingTop: 50, paddingRight: 30, paddingBottom: 40, paddingLeft: 30,
    backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor:"#ddd",
    height: 170,
  },
  sectionTime: {
    fontSize: 20,
    fontWeight: "100",
    color: "#555",
    position: "absolute",
    left: Util.size.width-140,
    top: 30
  },
  totalTime: {
    fontSize: Util.size.width === 375 ? 70:60,
    fontWeight: "100",
    color: "#222",
    paddingLeft: 20
  },
  watchControllerContainer: {
    width: Util.size.width,
    flexDirection: "row",
    backgroundColor: '#f3f3f3',
    paddingTop: 30, paddingLeft: 60, paddingRight:60, paddingBottom:30,
  },
  btnStart: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center"
  },
  btnStop: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center"
  },
  recordList: {
    width: Util.size.width,
    height: Util.size.height - 300
  },
  listItem: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: Util.pixel, borderBottomColor: "#bbb"
  },
  listItemTitle: {
    color:"#777"
  },
  listItemTime: {
    color:"#777"
  }
})