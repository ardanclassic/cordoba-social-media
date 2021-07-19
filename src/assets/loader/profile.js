import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props) => (
  <ContentLoader 
    speed={3}
    width={900}
    height={300}
    viewBox="0 0 900 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#e3e3e3"
    {...props}
  >
    <rect x="319" y="151" rx="3" ry="3" width="200" height="10" /> 
    <rect x="317" y="45" rx="15" ry="15" width="395" height="20" /> 
    <circle cx="195" cy="136" r="106" /> 
    <rect x="539" y="151" rx="3" ry="3" width="200" height="10" /> 
    <rect x="319" y="191" rx="3" ry="3" width="310" height="25" /> 
    <rect x="644" y="192" rx="3" ry="3" width="35" height="25" /> 
    <rect x="319" y="75" rx="8" ry="8" width="250" height="10" /> 
    <rect x="319" y="106" rx="3" ry="3" width="200" height="40" /> 
    <rect x="539" y="106" rx="3" ry="3" width="200" height="40" />
  </ContentLoader>
)

export default MyLoader

