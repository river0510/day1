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
  constructor(props){
    super(props);
    this.state = {
      record: [
        {title: "", time: ""},
        {title: "", time: ""},
        {title: "", time: ""},
        {title: "", time: ""},
        {title: "", time: ""},
        {title: "", time: ""},
        {title: "", time: ""},
        {title: "", time: ""},
      ]
    }
  }

  render(){
    return (
      <View>
        <WatchFace sectionTime="00:00.00" totalTime="00:00.00"/>
        <WatchController startWatch={()=>{}} stopWatch={()=>{}} addRecord={()=>{}} clearRecord={()=>{}}/>
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