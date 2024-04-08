import { useRef, useState } from 'react';
import { Stage, Layer, Star, Text, Rect, Group, Arc,Path, Line, Circle, TextPath } from 'react-konva';
import { v4 as uuid } from 'uuid';

const Pather = ({radius,...props})=>{
    return <Path
    {...props}
    // stroke="white"
    strokeWidth={4}
    data={`M 0 ${-radius} A ${radius} ${radius} 0 0 1 0 ${radius}`}
  />
}


const Clicker = ({type,charge,source = null,onClick,points,radius,hoverColor,setRef,id = null,setOutput = ()=>{}})=>{
    const [color,setColor] = useState('black')
    const ref = useRef()
    return <Group type={type !== 'charge'?type:null}>
        <Line stroke='black' points={points}/>
        <Circle 
            setOutput={setOutput}
            charge={charge}
            clicker={true}
            source={source}
            id={id} ref={ref}
            onPointerOut={(e)=>{
                if(!e.target.attrs?.connected) 
                setColor('black') 
                else{ setColor('black')};
            }} 
            onPointerEnter={(e)=>{
                if(!e.target.attrs?.connected) 
                setColor('red')
                else{ setColor('black')};
                }} 
            onClick={()=>{onClick(ref.current)}} 
            y={points[3]} x={(points[2])/1} 
            type={type} 
            radius={radius} 
            fill={color} 
            stroke={color}
        >

        </Circle>
    </Group>
        
}

const AndGate = ({setRef,...props})=>{
    const id  = uuid()
    return <>
        <Group name='andGate' circuit={true} draggable onDragStart={props.onDragStart} onDragMove={props.onDragMove} {...props}>
            <Rect shadowOpacity={0.5} shadowBlur={10} shadowEnabled shadowOffset={{x:10,y:5}} shadowColor="black" width={40} height={50} fill='lightblue'/>
            <Pather fill={"lightblue"} x={39} y={25}  radius={25}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'output'} id={uuid()} points={[64,25,80,25]} radius={3}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'input'} id={uuid()} points={[0,5,-20,5]} radius={3}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'input'} id={uuid()} points={[0,45,-20,45]} radius={3}/>
            <Text x={20} y={20} text='AND'></Text>
        </Group>
    </>
}
const OrGate = ({setRef,...props})=>{
    const id  = uuid()

    return <>
        <Group name='orGate' circuit={true} draggable onDragStart={props.onDragStart} onDragMove={props.onDragMove} {...props}>
            <Rect shadowOpacity={0.5} shadowBlur={10} shadowEnabled shadowOffset={{x:10,y:5}} shadowColor="black" width={40} height={50} fill='lightblue'/>
            <Pather fill={"white"} x={-0.5} y={25}  radius={25}/>
            <Pather fill={"lightblue"} x={39} y={25}  radius={25}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'output'} id={uuid()} points={[64,25,80,25]} radius={3}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'input'} id={uuid()} points={[0,1,-20,1]} radius={3}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'input'} id={uuid()} points={[0,49,-20,49]} radius={3}/>
            <Text x={30} y={20} text='OR'></Text>
            </Group>
    </>
}
const NorGate = ({setRef,...props})=>{
    const id  = uuid()

    return <>
        <Group name='xorGate' circuit={true} draggable onDragStart={props.onDragStart} onDragMove={props.onDragMove} {...props}>
            <Rect shadowOpacity={0.5} shadowBlur={10} shadowEnabled shadowOffset={{x:10,y:5}} shadowColor="black" width={40} height={50} fill='lightblue'/>
            <Pather  fill={"white"} x={-0.5} y={25}  radius={25}/>
            <Pather fill={"lightblue"} x={39} y={25}  radius={25}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'output'} id={uuid()} points={[64,25,80,25]} radius={3}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'input'} id={uuid()} points={[-3,2.5,-30,2.5]} radius={3}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'input'} id={uuid()} points={[-3,47.5,-30,47.5]} radius={3}/>
            <Pather  stroke={"lightblue"} x={-3} y={25} strokeWidth={0.5} radius={22}/>
            <Text x={30} y={20} text='XOR'></Text>
        </Group>
    </>
}
const XNorGate = ({setRef,...props})=>{
    const id  = uuid()

    return <>
        <Group name='xnorGate' circuit={true} draggable onDragStart={props.onDragStart} onDragMove={props.onDragMove} {...props}>
            <Rect shadowOpacity={0.5} shadowBlur={10} shadowEnabled shadowOffset={{x:10,y:5}} shadowColor="black" width={40} height={50} fill='lightblue'/>
            <Pather fill={"white"} x={-0.5} y={25}  radius={25}/>
            <Pather fill={"lightblue"} x={39} y={25}  radius={25}/>
            <Pather stroke={"lightblue"} x={-3} y={25} strokeWidth={0.5}   radius={22}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'output'} id={uuid()} points={[64,25,90,25]} radius={1.5}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'input'} id={uuid()} points={[-3,2.5,-30,2.5]} radius={3}/>
            <Clicker setRef={setRef} onClick={props?.onClick} type={'input'} id={uuid()} points={[-3,47.5,-30,47.5]} radius={3}/>
            <Circle stroke={'black'} fill='white' radius={5} x={70} y={25}/>
            <Text x={30} y={20} scaleX={0.8} scaleY={0.8} text='XNOR'></Text>

        </Group>
    </>
}


const Charge = ({setRef,charge,...props})=>{

        return <>
            <Group draggable onDragStart={props.onDragStart} onDragMove={props.onDragMove} {...props}>
                <Text fontSize={15} x={-5} y={-25} text={charge}/>
                <Clicker source={true} setRef={setRef} onClick={props?.onClick} charge={charge} type={'charge'} id={uuid()} points={[0,0,0]} radius={8}/>
            </Group>
        </>
}

const Point = ({setRef,...props})=>{

    return <>
        <Group draggable onDragStart={props.onDragStart} onDragMove={props.onDragMove} {...props}>
            <Text fontSize={8} x={-10} y={-20} text={'point'}/>
            <Clicker source={true} setRef={setRef} onClick={props?.onClick} type={'point'} id={uuid()} points={[0,0,0]} radius={8}/>
        </Group>
    </>
}

const Screen = ({setRef,charge,...props})=>{
    const [output,setOutput] = useState(0)
    return <>
    <Group draggable onDragStart={props.onDragStart} onDragMove={props.onDragMove} {...props}>
        <Rect 
            y={-10}
            width={50}
            height={25}
            stroke={'black'}
        />
        <Text x={6} y={-25} text='output'/>
        <Text screenViewer={true} x={22} y={-3} text={output}/>
        <Clicker setOutput={setOutput}  source={true} setRef={setRef} onClick={props?.onClick} type={'screen'} id={uuid()} points={[0,0,0]} radius={3}/>
    </Group>
</>
}

export {AndGate,OrGate,NorGate,XNorGate,Charge,Point,Screen}