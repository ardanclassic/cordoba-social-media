import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props) => (
  <ContentLoader 
    speed={3}
    width={600}
    height={500}
    viewBox="0 0 600 500"
    backgroundColor="#ebf1f4"
    foregroundColor="#ffffff"
    {...props}
  >
    <rect x="15" y="8" rx="5" ry="5" width="119" height="10" /> 
    <rect x="15" y="38" rx="5" ry="5" width="119" height="10" /> 
    <rect x="15" y="68" rx="5" ry="5" width="119" height="10" /> 
    <rect x="15" y="98" rx="5" ry="5" width="119" height="10" /> 
    <rect x="170" y="4" rx="8" ry="8" width="234" height="30" /> 
    <rect x="343" y="43" rx="3" ry="3" width="57" height="26" /> 
    <circle cx="320" cy="57" r="15" /> 
    <rect x="15" y="126" rx="5" ry="5" width="119" height="10" /> 
    <rect x="15" y="156" rx="5" ry="5" width="119" height="10" /> 
    <rect x="15" y="186" rx="5" ry="5" width="119" height="10" /> 
    <rect x="15" y="216" rx="5" ry="5" width="119" height="10" /> 
    <rect x="445" y="7" rx="5" ry="5" width="119" height="10" /> 
    <rect x="445" y="37" rx="5" ry="5" width="119" height="10" /> 
    <rect x="445" y="67" rx="5" ry="5" width="119" height="10" /> 
    <rect x="445" y="97" rx="5" ry="5" width="119" height="10" /> 
    <rect x="445" y="125" rx="5" ry="5" width="119" height="10" /> 
    <rect x="445" y="155" rx="5" ry="5" width="119" height="10" /> 
    <rect x="445" y="185" rx="5" ry="5" width="119" height="10" /> 
    <rect x="445" y="215" rx="5" ry="5" width="119" height="10" /> 
    <rect x="172" y="107" rx="8" ry="8" width="234" height="117" /> 
    <rect x="175" y="235" rx="3" ry="3" width="230" height="16" /> 
    <rect x="173" y="276" rx="8" ry="8" width="234" height="117" /> 
    <rect x="176" y="404" rx="3" ry="3" width="230" height="16" />
  </ContentLoader>
)

export default MyLoader

