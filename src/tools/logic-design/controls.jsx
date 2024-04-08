import { Group, Layer, Stage,Text } from "react-konva";
import { AndGate, Charge, NorGate, OrGate, XNorGate,Point,Screen, Lamp } from "./lgComponents";


export default function Controls({elements,setElements}){



    return <>
    <div className="absolute left-0 top-[71px] bg-white border-r-2 border-gray z-50 ">
        <Stage width={200} height={window.innerHeight * 0.8}>
            <Layer>
                <Text x={35} y={2} fontSize={20} Text={'Show Board'}/>
                <Group y={20}>
                    <Text x={2} y={25} Text={'Click to create'}/>
                    <OrGate onClick={()=>{setElements([...elements,{type:'or'}])}} scaleX={0.5} scaleY={0.5} draggable={false} x={30} y={50}/>
                    <AndGate onClick={()=>{setElements([...elements,{type:'and'}])}} scaleX={0.5} scaleY={0.5} draggable={false} x={30} y={100}/>
                    <NorGate onClick={()=>{setElements([...elements,{type:'nor'}])}} scaleX={0.5} scaleY={0.5} draggable={false} x={30} y={150}/>
                    <XNorGate onClick={()=>{setElements([...elements,{type:'xnor'}])}} scaleX={0.5} scaleY={0.5} draggable={false} x={30} y={200}/>
                </Group>
                <Group y={250}>
                    <Text x={2} y={25} Text={'Click to create'}/>
                    <Charge charge={0} onClick={()=>{setElements([...elements,{type:'zInput'}])}} draggable={false} x={30} y={60}/>
                    <Charge charge={1} onClick={()=>{setElements([...elements,{type:'oInput'}])}} draggable={false} x={30} y={100}/>
                    {/* <Point onClick={()=>{setElements([...elements,{type:'point'}])}} draggable={false} x={30} y={140}/> */}
                </Group>
                <Group y={400}>
                    <Lamp  onClick={()=>{setElements([...elements,{type:'lamp'}])}} draggable={false} x={10} y={50}/>
                    <Screen  onClick={()=>{setElements([...elements,{type:'screen'}])}} draggable={false} x={30} y={60}/>
                </Group>
            </Layer>
        </Stage>
    </div>
    </>
}








