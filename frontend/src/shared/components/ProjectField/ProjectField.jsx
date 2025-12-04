export default function ProjectField({ projectName, organizationName, roleName }) {
  
return <div className="border glass rounded-lg p-4">
   <div className="flex justify-between">
     <p className="text-2xs distance-bottom-sm text-left text-white">{organizationName}</p>
     <p className="text-xs distance-bottom-sm text-left text-gray-300">{roleName}</p>
   </div>
      <p className="text-xs distance-bottom-sm text-left text-white">{projectName}</p>
  </div>
}