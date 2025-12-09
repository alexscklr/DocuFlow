

export default function InfoField({ title, info }) {

    return
    <div className="grid grid-cols-1">
        <p className="text-s text-left distance-bottom-xs">{title}</p>
        <div className="border rounded-lg p-2 distance-bottom-md">
            <p className="text-xs text-left text-gray-500">{info}</p>
        </div>
    </div>
}