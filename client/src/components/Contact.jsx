import Avtar from "./Avtar"

const Contact = ({ id, username, onClick, selected, online }) => {
    return (
        <div
            className={"border-b border-gray-100 flex gap-2 items-center cursor-pointer " + (selected ? 'bg-blue-50' : '')}
            key={id}
            onClick={() => onClick(id)}>
            {selected && (
                <div className="w-1 bg-blue-500 h-12 rounded-tr-md"></div>
            )}
            <div className=" flex gap-2 py-2 px-4 items-center">
                <Avtar online={online} username={username} userId={id} />
                <span className="text-gray-800">{username}</span>
            </div>
        </div>
    )
}

export default Contact