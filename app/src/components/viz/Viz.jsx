import React, { Component } from 'react'
// import { Toggle } from 'carbon-components-react';
// import { loadJSONData } from "../helperfunctions/HelperFunctions"
import "./viz.css"
import LineChart from "../linechart/LineChart"
import SmallLineChart from "../linechart/SmallLineChart"
import DrawSignal from "../drawsignal/DrawSignal"
// import "../../data" 


class Viz extends Component {
    constructor(props) {
        super(props)

        this.modelChartWidth = Math.min(390, window.innerWidth - 25)
        this.modelChartHeight = 300

        // Allow the draw signal component update current signal with drawn signal
        this.updateCurrentSignal = this.updateCurrentSignal.bind(this)

 
        this.testData = require("../../data/ecg/test.json")
        this.testData = this.testData.slice(0, 70)
        this.state = {
            apptitle: "Anomagram", 
            trainData: [],
            selectedIndex:0,
            selectedData: this.testData[0].data,
            showDrawData: true,
            drawSectionWidth: 350,
            drawSectionHeight: this.modelChartHeight - 30
        }


        // this.trainData = require("../../data/ecg/train.json")
        // console.log(this.testData.length, this.trainData.length)

        this.loadData()

        this.chartColorMap = {
            1: { color: "#0062ff", colornorm: "#0062ff", name: "Normal" },
            2: { color: "#ffa32c", colornorm: "grey", name: "R-on-T Premature Ventricular Contraction" },
            3: { color: "violet", colornorm: "grey", name: "Supraventricular Premature or Ectopic Beat " },
            4: { color: "orange", colornorm: "grey", name: "Premature Ventricular Contraction" },
            5: { color: "red", colornorm: "grey", name: "Unclassifiable Beat" },
        }

        this.maxSmallChart = 100
        this.modelDataLastUpdated = true
        

    }

    updateCurrentSignal(data) {
        // console.log(data);
        this.modelDataLastUpdated = !this.modelDataLastUpdated 
        // console.log(this.state.selectedData); 
        this.setState({ selectedData: data })
       
    }

    loadData() {
        // let testECGDataPath = process.env.PUBLIC_URL + "/data/ecg/test_small.json"
        // let trainECGDataPath = process.env.PUBLIC_URL + "/data/ecg/train_small.json"
        // loadJSONData(testECGDataPath).then(data => {
        //     this.setState({ testData: data })
        //     // console.log("test data loaded", data.length)
        // })

        // loadJSONData(trainECGDataPath).then(data => {
        //     this.setState({ trainData: data })
        // })

    }
    componentDidUpdate(prevProps, prevState) {


    }


    componentDidMount() {
        this.apptitle = "Amadioha"

        // window.addEventListener("resize", this.onWindowResize.bind(this))
        // console.log(this.refs["datasection"].offsetWidth)
        this.setState({ drawSectionWidth: this.refs["datasection"].offsetWidth -5 })
        this.drawSectionWidth = this.refs["datasection"].offsetWidth
        

    }

    componentWillUnmount() {
        // window.removeEventListener("resize", this.onWindowResize)

    }

    onWindowResize() {
        console.log(this.refs["datasection"].offsetWidth);
        
        this.setState({ drawSectionWidth: this.refs["datasection"].offsetWidth -5 })
    }

    clickDataPoint(e) {
        this.modelDataLastUpdated = !this.modelDataLastUpdated 
        this.setState({ selectedData: this.testData[e.target.getAttribute("indexvalue")].data })
        this.setState({selectedIndex: e.target.getAttribute("indexvalue")})

        let colorAttrr = e.target.getAttribute("targetval") + "" === "1" ? "green" : "red"
        // console.log(e.target.getAttribute("targetval"), colorAttrr)
        this.refs.labelcolordiv.style.backgroundColor = colorAttrr
        this.refs.predictioncolordiv.style.backgroundColor = colorAttrr
    }

    toggleDataOptions(e) { 
        this.setState({showDrawData: e})
    }
    setDatasetDraw(e) {
        this.setState({ showDrawData: true })
        // this.setState({ drawSectionWidth: this.refs["datasection"].offsetWidth })
        console.log(this.refs["datasection"].offsetWidth);
        
    }
    setDatasetECG(e) {
        this.setState({showDrawData: false})
    }

    render() {


        let dataLegend = Object.entries(this.chartColorMap).map((data, index) => {
            let color = data[1].color
            let name = data[1].name
            return (
                <div className="iblock mr10 mb5" key={"legendrow" + index}>
                    <div style={{ background: color }} className="indicatorcircle iblock mr5"></div>
                    <div className="iblock legendtext pl4 mediumdesc"> {name}</div>
                    <div className="iblock"></div>

                </div>
            )
        });

        let dataPoints = this.testData.slice(0, this.maxSmallChart).map((data, index) => {
            return (
                <div onClick={this.clickDataPoint.bind(this)} key={"testrow" + index} className={"mb5 p5 clickable  ecgdatapoint rad3 iblock mr5" + (this.state.selectedIndex + "" === (index + "") ? " active" : "")} indexvalue={index} targetval={data.target} >
                    <div indexvalue={index} className="boldtext  unclickable iblock ">

                        <div className="positionrelative">
                            <div className="p3 indicatoroutrcircle  positionabsolute bottomright">
                                <div style={{ background: this.chartColorMap[this.testData[index].target].color }} className="indicatorcircle "></div>
                            </div>
                            <SmallLineChart
                                data={{
                                    data: this.testData[index],
                                    index: index,
                                    color: this.chartColorMap[this.testData[index].target].colornorm,
                                    chartWidth: 72,
                                    chartHeight: 30
                                }}
                            > </SmallLineChart>
                        </div>

                    </div>

                </div>
            )
        });

        let datasetExamples = (
            <div>
                <div className="  ">
                       
                        <div className="mb5">
                            {dataLegend}
                        </div>
                        <div className="ecgdatabox scrollwindow">
                            {dataPoints}
                        </div>
                    </div>
            </div>
        )

        let dataSketchPad = (
            <div > 
                <DrawSignal
                    width={this.state.drawSectionWidth}
                    height={this.state.drawSectionHeight}
                    updateCurrentSignal = {this.updateCurrentSignal}
                ></DrawSignal>
            </div>
        )

        let modelOutput = (
            <div className=" p10 modeloutputbox rad5 ">
                        <div className="mb10 boldtext"> Model Output</div>
                        <div className=""> 
                            {this.testData.length > 0 &&
                                <div>
                                    <div className="flex mediumdesc mb5 displaynone">
                                        <div className="mr10 boldtext"> Label </div>
                                        <div ref="labelcolordiv" className="flexfull colorbox greenbox"></div>
                                        {/* <span className="boldtext"> </span>: {this.chartColorMap[this.testData[this.state.selectedData].target].name} */}
                                    </div>
                                    <div className="flex mediumdesc mb5">
                                        <div className="mr10 boldtext">
                                            {this.testData[this.state.selectedIndex].target + "" === "1" ? "NORMAL" : "ABNORMAL"}
                                        </div>
                                        <div ref="predictioncolordiv" className="flexfull colorbox redbox"></div>
                                        {/* <span className="boldtext"> </span>: {this.chartColorMap[this.testData[this.testData].target].name} */}
                                    </div>

                                    <div className="iblock"> 
                                        <LineChart
                                            
                                                data= {this.state.selectedData}
                                index={this.state.selectedIndex}
                                lastUpdated = {this.modelDataLastUpdated}
                                                color={this.chartColorMap[this.testData[this.state.selectedIndex].target].colornorm}
                                                width={this.modelChartWidth}
                                                height= {this.modelChartHeight}
                                             
                                            
                                        > </LineChart>
                                    </div>
                                </div>
                            } 
                        </div> 
            </div>
        )

        // if (this.refs["datasetexamplebox"]) {
        //     console.log(this.refs["datasetexamplebox"].offsetWidth);
        // } 

        return (
            <div> 
                <div className="bold mt10 sectiontitle mb10">
                    A Gentle Introduction to Anomaly Detection with Deep Learning (in the Browser!)
                </div>

                <div className="mynotif h100 lh10  lightbluehightlight maxh16  mb10">
                    {this.state.apptitle} is an interactive visualization tool for exploring
                    deep learning models applied to the task of anomaly detection (on stationary data).
                </div> 
                 
                
                <div className="mediumdesc pb5 "> Select  Data source</div>
                 
                <div className="mb10 lowerbar">
                    <div onClick={this.setDatasetECG.bind(this)} className={"datasettab clickable iblock mr5 " + (this.state.showDrawData ? "" : " active")}> ECG5000 Dataset</div>
                    <div onClick={this.setDatasetDraw.bind(this)} className={"datasettab clickable iblock mr10 " + (this.state.showDrawData ? " active" : " ")}> Draw your ECG data</div>
                </div>
 
                <div  className="flex flexwrap ">
                    
                    <div ref="datasection" className=" flexwrapitem  flex20 " >
                            { <div ref="datasetexamplebox" className={" " + (this.state.showDrawData ? " displaynone" : " ")}>
                            {datasetExamples}
                            </div> }
                            {<div className={" " + (!this.state.showDrawData ? " displaynone" : " ")}>
                            {dataSketchPad}
                            </div> }
                    </div>
                   
                    <div className="flexwrapitem">
                        {modelOutput}
                    </div> 
                </div>
                <div className="lh10 ">
                    We have trained a two layer autoencoder with 2600 samples of normal ECG signal data.
                    Each ECG signal contains 140 recordings of the electrical signal of the heart, corresponding to a heartbeat.
                    Our test set (above) contains both normal and abormal ECG signals, and our model is tasked with distinguishing normal from abnormal signal.

                </div>


                { 
                <div className=" "> 
                    <div className="sectiontitle mt10 mb5"> An Introduction to Autoencoders </div>
                    <div className="">
                        <div className="flex">
                            <div className="flex6 lh10 mb10 pr10">
                            An autoencoder is a neural network that learns to map input data to a low dimension representation
                                and then reconstruct the original input from this low dimension representation. The part of the network which learn the input to 
                                low dimension mapping is termed an encoder, while the section that maps from low dimension back to original input is termed the decoder.
                            This capability of producing a low dimension representation is reminiscent dimensionality reduction approaches (e.g. PCA), and indeed
                            Autoencoders have been typically used for dimensionbality reduction and compression use cases. For an indepth treatment of autoencoders, please see ... 
                            
                            However, while 
                            </div>

                            <div className="border rad4 p10 flex4" style={{ height:"200px"}}>
                                small autoencoder viz
                            </div>
                        </div>

                    </div>


                    <div className="sectiontitle mt10 mb5"> Modeling Normal Data  </div>
                    <div className="">
                        <div className="flex lh10 flexwrap">
                            <div className="flex20 flexwrapitem  mb10 pr10">
                                <div className="pb5 boldtext"> Data Standardization  </div>
                                                Most approaches to anomaly detection (and there are many) begin by constructing a model of 
                                            normal behaviour and then exploit this model to identify deviations from normal (anomalies or abnormal data).
                                        Here is how we can use an autoencoder to model normal behaviour. If you recall, an autoencoder learns to compress 
                                        and reconstruct data. Notably this learned mapping is specific to the data type/distribution distribution of the training data.
                                        In other words an autoencoder trained using 15 px images of dogs is unlikely to correctly reconstruct 20px images of the surface 
                                        of the moon.
                            </div>
                            <div className=" flex20 flexwrapitem mr10">
                                    <div className="pb5 boldtext"> Model Training </div>
                                    Most approaches to anomaly detection (and there are many) begin by constructing a model of 
                                        normal behaviour and then exploit this model to identify deviations from normal (anomalies or abnormal data).
                                    Here is how we can use an autoencoder to model normal behaviour. If you recall, an autoencoder learns to compress 
                                    and reconstruct data. Notably this learned mapping is specific to the data type/distribution distribution of the training data.
                                    In other words an autoencoder trained using 15 px images of dogs is unlikely to correctly reconstruct 20px images of the surface 
                                    of the moon.
                            </div>
                            

                            <div className="border rad4 p10 " style={{ width:"300px", height:"300px"}}>
                               Interactive replay of training run visualization
                            </div>
                        </div>

                    </div>

                    <div className="sectiontitle mt10 mb5"> Model Evaluation: Accuracy is NOT Enough </div>
                    <div className="">
                        <div className="flex">
                            <div className="flex6 lh10 mb10 pr10">
                            Data for this problem is likely imbalanced. The number of anomalies we encounter is likely to be much smaller than normal data.
                            Consider we have a bad classifiier that simply flags all our data points as normal, it would still have a high accuracy value. 

                            </div>

                            <div className="border rad4 p10 flex4" style={{ height:"200px"}}>
                                ROC curve and some metrics
                            </div>
                        </div>

                    </div>

                    <div className="sectiontitle mt10 mb10"> Effect of Model Parameters </div>
                    <div className="flex flexwrap">
                        
                            <div className="flex3 flexwrapitem mr10">
                                <div className="flex6 lh10 mb10 pr10">
                                    <div className="pb5 boldtext"> Learning Rate </div>
                                Data for this problem is likely imbalanced. The number of anomalies we encounter is likely to be much smaller than normal data.
                                Consider we have a bad classifiier that simply flags all our data points as normal, it would still have a high accuracy value. 

                                </div>

                                
                            </div>
                            
                            <div className="flex3 flexwrapitem  mr10">
                                <div className="flex6 lh10 mb10 pr10">
                                <div className="pb5 boldtext"> Regularization </div>
                                Data for this problem is likely imbalanced. The number of anomalies we encounter is likely to be much smaller than normal data.
                                Consider we have a bad classifiier that simply flags all our data points as normal, it would still have a high accuracy value. 

                                </div>

                                
                            </div>
                            
                            <div className="flex4 flexwrapitem  mr10">
                                <div className="flex6 lh10 mb10 pr10">
                                <div className="pb5 boldtext"> Batch Size </div>
                                Data for this problem is likely imbalanced. The number of anomalies we encounter is likely to be much smaller than normal data.
                                Consider we have a bad classifiier that simply flags all our data points as normal, it would still have a high accuracy value. 

                                </div> 
                            </div> 

                            <div className="flex4 flexwrapitem  mr10">
                                <div className="flex6 lh10 mb10 pr10">
                                <div className="pb5 boldtext"> Abnormal Percentage </div>
                                Data for this problem is likely imbalanced. The number of anomalies we encounter is likely to be much smaller than normal data.
                                Consider we have a bad classifiier that simply flags all our data points as normal, it would still have a high accuracy value. 

                                </div> 
                            </div> 
                        </div>
                        

                    <div className="sectiontitle mt10 mb5"> Lottery Tickets: Winning Initializations </div>
                    <div className="">
                        <div className="flex">
                            <div className="flex6 lh10 mb10 pr10">
                                Ever heard of a weird thing with neural networks called a lottery ticket?
                                    While the problem in this example is relatively too simple (140 features, not so complex patters)
                                An observation of what happens each time the autoencoder is initialized can provide insights into the
                                how luck some nerual network initializations can be.
                                In essence, there are initializationsss that immeidately result in a high performance (good AUC) mpodel
                                and require very littl     
                                while others are just plain bad.
                            </div>

                            <div className="border rad4 p10 flex4" style={{ height:"200px"}}>
                                ROC curve and some metrics
                            </div>
                        </div>

                    </div>
                </div>
                }
                                
                                 
                 
                
                
                
                <div>
                    {/* A VAE (an extension of an AE) can allow us generate sampled data without */}
                </div>





                <br />
                <br />
                <br />
                <br/>
            </div>
        )
    }
}

export default Viz