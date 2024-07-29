import { CellValue } from "@/utils/gameSetting";

type CellProps = {
    value: CellValue;
    onClick: () => void;
};

const Cell = ({value, onClick}: CellProps) => {
    const cellStyle = `flex justify-center items-center w-10 h-10 border border-gray-800 bg-green-400`;
    const pieceStyle = `rounded-full ${value === 'black' ? 'bg-black' : 'bg-white'}`;
    const isPiece = value === 'black' || value === 'white';
    return (
        <div 
            onClick={onClick} 
            className={cellStyle} 
            style={{ width: '40px', height: '40px' }}
        >
        {isPiece && <div className={pieceStyle} style={{ width: '30px', height: '30px' }}></div>}
        </div>
    );
}
export default Cell;