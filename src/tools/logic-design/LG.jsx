import { Stage, Layer, Rect, Line, Group } from 'react-konva';
import { AndGate, Charge, NorGate, OrGate, Point, XNorGate,Screen, Lamp } from './lgComponents';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
const LG = ({elements}) => {
    const stage = useRef();
    const mainGroup = useRef();
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [currentPoint, setCurrentPoint] = useState(null);
    const [currentPointPosition, setCurrentPointPosition] = useState({ x: 0, y: 0 });
    const [updatedLines, setUpdatedLines] = useState([]);
    const [realLines, setRealLines] = useState([]);
    const [simulationResults,setSimulationResults] = useState([])
    const [update,setUpdate] = useState(false)
    const getTwoElements = (ids)=>{
        const stageRef = stage.current.getStage();

        let id1 = ids[0]
        let id2 = ids[1]
        const element1 = stageRef.find(node => node._id === id1)[0];
        const element2 = stageRef.find(node => node._id === id2)[0];

        return {element1,element2}
    }

    const updateLines = () => {
        const updatedRealLines = [];
        updatedLines.forEach(element => {
            const {element1,element2} = getTwoElements(element)
            element1.attrs.connected = true
            element2.attrs.connected = true

            if(element1.attrs.type === 'charge'){
                if(!element1.attrs?.connectionId)
                element1.attrs.connectionId = []
                
                let array = [...element1.attrs.connectionId]
                if(!array.includes(element[2]))
                element1.attrs.connectionId = [...element1.attrs.connectionId,element[2]]
            }
            else
            element1.attrs.connectionId = element[2]

            if(element2.attrs.type === 'charge'){
                if(!element2.attrs?.connectionId)
                element2.attrs.connectionId = []

                let array = [...element2.attrs.connectionId]
                if(!array.includes(element[2]))
                element2.attrs.connectionId = [...element2.attrs.connectionId,element[2]]
            }
            else
            element2.attrs.connectionId = element[2]

            const pos1 = element1?.absolutePosition();
            const pos2 = element2?.absolutePosition();
            if(!element1.attrs?.source){
                element1.fill('transparent')
                element1.stroke('transparent')
            }
            if(!element2.attrs?.source){
                element2.fill('transparent')
                element2.stroke('transparent')
            }
            const newLine = {
                stroke: 'black',
                points: [pos1.x, pos1.y, pos2.x, pos2.y],
                id: `${element[0]}+${element[1]}`
            };
            updatedRealLines.push(newLine);
        });

        setRealLines(updatedRealLines);
    };
    function disconnect(e) {
        console.log(e);
        
        // Copying the array to avoid mutating the original
        let array = [...updatedLines];
        
        // Finding the index of the connection to disconnect
        let index = array.findIndex(element => {
            return element[0] === e._id || element[1] === e._id;
        });
        
        console.log(index, e._id);
        const {element1, element2} = getTwoElements(array[index]);
        setTimeout(() => {
            if(element1.attrs.type !== 'charge'){
                element1.attrs.charge = null;
            }
            if(element2.attrs.type !== 'charge'){
                element2.attrs.charge = null;
            }


            element1.attrs.connected = null;
            element2.attrs.connected = null;
            element1.attrs.connectionId = null;
            element2.attrs.connectionId = null;
            element1.fill('black');
            element2.fill('black');
            element1.stroke('black');
            element2.stroke('black');
        }, 500);
        
        if (index >= 0) {
            console.log('Connection found');
            array.splice(index, 1);
            setUpdatedLines(array);
            updateLines();
        } else {
            console.log('Connection not found');
        }
    }
    
    function handleClick(e) {
        setUpdate(!update)
        setTimeout(() => {
            if (e.attrs.type === 'input' && currentPoint && currentPoint.attrs.type === 'output') {
                setUpdatedLines([...updatedLines, [e._id, currentPoint._id,uuid()]]);
                setCurrentPoint(null);
                return;
            }
            if (e.attrs.type === 'input' && currentPoint && currentPoint.attrs.type === 'charge') {
                setUpdatedLines([...updatedLines, [e._id, currentPoint._id,uuid()]]);
                setCurrentPoint(null);
                return;
            }
            if (e.attrs.type === 'screen' && currentPoint && currentPoint.attrs.type === 'output') {
                setUpdatedLines([...updatedLines, [e._id, currentPoint._id,uuid()]]);
                setCurrentPoint(null);
                return;
            }
            if (e.attrs.type === 'output' && currentPoint && currentPoint.attrs.type === 'screen') {
                setUpdatedLines([...updatedLines, [e._id, currentPoint._id,uuid()]]);
                setCurrentPoint(null);
                return;
            }
            if (e.attrs.type === 'charge' && currentPoint && currentPoint.attrs.type === 'input') {
                setUpdatedLines([...updatedLines, [e._id, currentPoint._id,uuid()]]);
                setCurrentPoint(null);
                return;
            }
            if (e.attrs.type === 'output' && currentPoint && currentPoint.attrs.type === 'input') {
                setUpdatedLines([...updatedLines, [e._id, currentPoint._id,uuid()]]);
                setCurrentPoint(null);
                return;
            }

            if (e.attrs.type === 'point' && currentPoint && currentPoint.attrs.type === 'input') {
                setUpdatedLines([...updatedLines, [e._id, currentPoint._id,uuid()]]);
                setCurrentPoint(null);
                return;
            }
            if (e.attrs.type === 'output' && currentPoint && currentPoint.attrs.type === 'point') {
                setUpdatedLines([...updatedLines, [e._id, currentPoint._id,uuid()]]);
                setCurrentPoint(null);
                return;
            }
            if (e.attrs.type === 'point' && currentPoint && currentPoint.attrs.type === 'point') {
                setUpdatedLines([...updatedLines, [e._id, currentPoint._id,uuid()]]);
                setCurrentPoint(null);
                return;
            }
            if(e.attrs.connected && e.attrs.type !== 'charge'){
                disconnect(e)
                return
            }
            setCurrentPoint(e);

        }, 0);
    }
    useEffect(()=>{
        updateLines()
    },[updatedLines])
    useEffect(() => {
        if (currentPoint) {
            const attrs = currentPoint.absolutePosition();
            setCurrentPointPosition(attrs);
        }
    }, [cursor,update]);
    function setCharge(input1,input2,type){
            let charge = null
            // if(!input1&&!input2)
            // return
            if(type === 'orGate'){
                if(input1 === 0 && input2 === 1){
                    charge = 1
                }
                else if(input1 === 1 && input2 === 0){
                    charge = 1
                }
                else if(input1 === 1 && input2 === 1){
                    charge = 1
                }else if(input1 === 0 && input2 === 0){
                    charge = 0
                }else{
                    // console.log(input1,input2)
                    charge = 0
                    if(input1 === 1){
                        charge = 1
                    }
                    if(input2 === 1){
                        charge = 1
                    }
                }
                
            }
            else if(type === 'andGate'){
                if(input1 === 0 && input2 === 1){
                    charge = 0
                }
                else if(input1 === 1 && input2 === 0){
                    charge = 0
                }
                else if(input1 === 1 && input2 === 1){
                    charge = 1
                }else if(input1 === 0 && input2 === 0){
                    charge = 0
                }else 
                charge = -1
            }
            else if(type === 'xorGate'){
                // console.log('thisone',input1,input2 )
                if(input1 === 0 && input2 === 1){
                    charge = 1
                }
                else if(input1 === 1 && input2 === 0){
                    charge = 1
                }
                else if(input1 === 1 && input2 === 1){
                    charge = 0
                }else if(input1 === 0 && input2 === 0){
                    charge = 0
                }else 
                charge = -1
            }
            else if(type === 'xnorGate'){
                if(input1 === 0 && input2 === 1){
                    charge = 0
                }
                else if(input1 === 1 && input2 === 0){
                    charge = 0
                }
                else if(input1 === 1 && input2 === 1){
                    charge = 1
                }else if(input1 === 0 && input2 === 0){
                    charge = 1
                }else 
                charge = -1
            }

            // console.log(charge,type)
            return charge
    }
    function simulate (){
        const stageRef = stage.current.getStage();
        const elements = stageRef.find(node => node.attrs.type === 'charge');
        const circuits = stageRef.find(node => node.attrs.circuit);
        const screens = stageRef.find(node => node.attrs.type === 'screen');
        // console.log(screens)
        for (const element of elements){
            const connectionId = element.attrs.connectionId
            if(!connectionId){
                // console.log('conection error',element._id)
                continue;
            }
            // console.log(connectionId)
            for(const connection of connectionId){
                    const pair = stageRef.find(node => node.attrs.connectionId === connection)[0]
                    pair.attrs.charge = element.attrs.charge
                }
            }
            for(const circuit of circuits){
            const type = circuit.attrs.name
            const inputs = circuit.children.filter(e=>e.attrs.type === 'input')
            const input1 = inputs[0].children[1]
            const input2 = inputs[1].children[1]
            const output = circuit.children.find(e=>e.attrs.type === 'output').children[1]
            let check1 = input1.attrs.charge === 0 || input1.attrs.charge === 1
            let check2 = input2.attrs.charge === 0 || input2.attrs.charge === 1
            if(
                check1||check2
            ){
                let charge = setCharge(input1.attrs.charge,input2.attrs.charge,type)
                output.attrs.charge = charge
            }else{

                let connectionId1 = input1.attrs.connectionId
                let connectionId2 = input2.attrs.connectionId
                if(connectionId1){
                    try{
                        let input = stageRef.find(node => node.attrs.connectionId === connectionId1 && node._id !== input1._id)[0]
                        input1.attrs.charge = input?.attrs?.charge|| null
                    }catch{

                    }
                }
                if(connectionId2){
                    try{
                        let input = stageRef.find(node => node.attrs.connectionId === connectionId2 && node._id !== input2._id)[0]
                    input2.attrs.charge = input?.attrs?.charge || null
                    }catch{

                    }
                }

                let charge = setCharge(input1.attrs.charge,input2.attrs.charge,type)
                output.attrs.charge = charge
            }
        }
        for(const screen of screens){
            // console.log(screen)
            if(!screen?.children)
            continue;
            const clicker = screen.children[1]
            const connectionId = clicker.attrs.connectionId
            if(connectionId){
                const output = stageRef.find(node => node.attrs.connectionId === connectionId && node._id !== clicker._id)[0]
                if(output.attrs.charge ===0 || output.attrs.charge === 1)
                clicker.attrs.setOutput(output.attrs.charge)
                else
                clicker.attrs.setOutput(0)
            }else{
                clicker.attrs.setOutput(0)
            }
        }
    }
    useEffect(()=>{
        setInterval(() => {
            simulate()
        }, 10);
    },[])
    return (
        <>
        <button onClick={simulate} className='absolute left-10 top-2'>SIMULATE</button>
        <Stage ref={stage}
               onPointerMove={(e) => {
                   let pos = stage.current.getPointerPosition();
                   setCursor({ x: pos.x, y: pos.y });
                }}
                width={window.innerWidth * 0.8} height={window.innerHeight * 0.8}>
            <Layer>
                <Rect onClick={() => { setCurrentPoint(null) }} fill='white' x={0} y={0} width={window.innerWidth} height={window.innerHeight} />
                <Group ref={mainGroup}>
                {currentPoint && <Line stroke={'red'} points={[currentPointPosition.x, currentPointPosition.y, cursor.x, cursor.y]} />}
              
                {
                    elements.map(e=>{
                        
                        if(e.type === 'and')
                        return  <AndGate x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                        else if(e.type === 'or')
                        return  <OrGate x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                        else if(e.type === 'nor')
                        return  <NorGate x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                        else if(e.type === 'xnor')
                        return  <XNorGate x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                        else if(e.type ==='zInput')
                        return <Charge charge={0} x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                        else if(e.type ==='oInput')
                        return <Charge charge={1} x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                        else if(e.type ==='point')
                        return <Point  x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                        else if(e.type ==='screen')
                        return <Screen  x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                        else if(e.type ==='lamp')
                        return <Lamp  x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                    })
                }
                {/* <AndGate x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                <OrGate x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
                <NorGate x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/>
            <XNorGate x={100} y={100} onDragMove={()=>{updateLines()}} setRef={setCurrentPoint} onClick={handleClick}/> */}
                    {realLines.map(e => {
                        return <KonvaLine {...e} />;
                    })}
                </Group>
            </Layer>
        </Stage>
</>
    );
};

const KonvaLine = (props) => {
    return <Line {...props} />;
};

export default LG;
