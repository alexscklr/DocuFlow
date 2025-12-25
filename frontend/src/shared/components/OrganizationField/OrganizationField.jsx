export default function OrganizationField({  organizationName, description, date, id }) {

return (
    <button className="border glass rounded-lg p-4 text-left" onClick={() => navigate(`/organizations/${id}`)}>
      <div className="flex justify-between">
        <p className="text-2xs distance-bottom-sm text-white">
          {organizationName}
        </p>
        <p className="text-xs distance-bottom-sm text-gray-300">
          {new Date(date).toLocaleDateString()}
        </p>
      </div>

      <p className="text-xs distance-bottom-sm text-white">
        {description}
      </p>
    </button>
  );
}