import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";



export default function QrCode() {
  const [count, setCount] = useState(0)
  var value = "&consulta=@con@&pedidosite=@oid@&plataforma=@plat@";

  value = value.replace("@con@", "123456");
  value = value.replace("@oid@", "25384");
  value = value.replace("@plat@", "head");

  return (
   // Can be anything instead of `maxWidth` that limits the width.
<div style={{ height: "auto", margin: "0 auto", maxWidth: 340, width: "100%" }}>
  <QRCode
    size={512}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={value}
    viewBox={`0 0 512 512`}
  />
</div>
  )
}

