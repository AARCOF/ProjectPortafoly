const registroForm = document.getElementById("ipform");
registroForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const valip = document.getElementById("dirip").value;
  const subredes = parseInt(document.getElementById("subredes").value);

  if (isValidIPAddress(valip)) {
    const octets = valip.split(".");
    const firstOctet = parseInt(octets[0]);
    const binaryOctets = octets.map((octet) =>
      parseInt(octet, 10).toString(2).padStart(8, "0")
    );
    const firstBinaryOctets = parseInt(binaryOctets[0]);

    let ipClass,
      subnetMask,
      networkAddress,
      hostAddress,
      networkID,
      hostID,
      usableIPs,
      distributedNetworks,
      networkBits,
      hostBits,
      subnetMaskBinary,
      subnetMaskDecimal,
      numSubnets,
      numAddressesPerSubnet;

    if (firstOctet >= 1 && firstOctet <= 126) {
      ipClass = "A";
      subnetMask = "255.0.0.0 / 8";
      networkAddress = `${octets[0]}.0.0.0`;
      hostAddress = `${octets[0]}.${octets[1]}.${octets[2]}.${octets[3]}`;
      networkID = `${octets[0]}.0.0.0`;
      hostID = `${octets[1]}.${octets[2]}.${octets[3]}`;
      networkBits = `${binaryOctets[0]}.0.0.0`;
      hostBits = `${binaryOctets[1]}.${binaryOctets[2]}.${binaryOctets[3]}`;
      usableIPs = Math.pow(2, 24) - 2;
      distributedNetworks = Math.pow(2, 7);
    } else if (firstOctet >= 128 && firstOctet <= 191) {
      ipClass = "B";
      subnetMask = "255.255.0.0 / 16";
      networkAddress = `${octets[0]}.${octets[1]}.0.0`;
      hostAddress = `${octets[0]}.${octets[1]}.${octets[2]}.${octets[3]}`;
      networkID = `${octets[0]}.${octets[1]}.0.0`;
      hostID = `${octets[2]}.${octets[3]}`;
      networkBits = `${binaryOctets[0]}.${binaryOctets[1]}.0.0`;
      hostBits = `${binaryOctets[2]}.${binaryOctets[3]}`;
      usableIPs = Math.pow(2, 16) - 2;
      distributedNetworks = Math.pow(2, 14);
    } else if (firstOctet >= 192 && firstOctet <= 223) {
      ipClass = "C";
      subnetMask = "255.255.255.0 / 24";
      networkAddress = `${octets[0]}.${octets[1]}.${octets[2]}.0`;
      hostAddress = `${octets[0]}.${octets[1]}.${octets[2]}.${octets[3]}`;
      networkID = `${octets[0]}.${octets[1]}.${octets[2]}.0`;
      hostID = `${octets[3]}`;
      networkBits = `${binaryOctets[0]}.${binaryOctets[1]}.${binaryOctets[2]}.0`;
      hostBits = `${binaryOctets[3]}`;
      usableIPs = Math.pow(2, 8) - 2;
      distributedNetworks = Math.pow(2, 21);
    } else {
      ipClass = "Desconocida";
      subnetMask = "";
      networkAddress = "";
      hostAddress = "";
      networkID = "";
      hostID = "";
      networkBits = "";
      hostBits = "";
      usableIPs = "";
      distributedNetworks = "";
    }

    if (firstOctet >= 1 && firstOctet <= 126) {
      subnetMaskBinary = "11111111.00000000.00000000.00000000";
      subnetMaskDecimal = "255.0.0.0";
      numSubnets = Math.pow(2, 8 - subredes);
      numAddressesPerSubnet = Math.pow(2, 24 - subredes) - 2;
    } else if (firstOctet >= 128 && firstOctet <= 191) {
      subnetMaskBinary = "11111111.11111111.00000000.00000000";
      subnetMaskDecimal = "255.255.0.0";
      numSubnets = Math.pow(2, 16 - subredes);
      numAddressesPerSubnet = Math.pow(2, 16 - subredes) - 2;
    } else if (firstOctet >= 192 && firstOctet <= 223) {
      subnetMaskBinary = "11111111.11111111.11111111.00000000";
      subnetMaskDecimal = "255.255.255.0";
      numSubnets = Math.pow(2, 24 - subredes);
      numAddressesPerSubnet = Math.pow(2, 8 - subredes) - 2;
    }

    const table = `
            <table>
                <tr>
                    <th>Clase IP</th>
                    <th>Máscara de Subred</th>
                    <th>Dirección de Red</th>
                    <th>Dirección de Host</th>
                    <th>ID de Red</th>
                    <th>ID de Host</th>
                    <th>Número de IPs Configurables</th>
                    <th>Número de Redes Distribuidas</th>
                    <th>Bits de Red</th>
                    <th>Bits de Host</th>
                </tr>
                <tr>
                    <td>${ipClass}</td>
                    <td>${subnetMask}</td>
                    <td>${networkAddress}</td>
                    <td>${hostAddress}</td>
                    <td>${networkID}</td>
                    <td>${hostID}</td>
                    <td>${usableIPs}</td>
                    <td>${distributedNetworks}</td>
                    <td>${networkBits}</td>
                    <td>${hostBits}</td>
                </tr>
            </table>
        `;
    const table1 = `
                    <table>
                        <tr>
                            <th>Máscara de Subred (Binario)</th>
                            <th>Máscara de Subred (Decimal)</th>
                            <th>Número de Subredes</th>
                            <th>Número de Direcciones por Subred</th>
                        </tr>
                        <tr>
                            <td>${subnetMaskBinary}</td>
                            <td>${subnetMaskDecimal}</td>
                            <td>${numSubnets}</td>
                            <td>${numAddressesPerSubnet}</td>
                        </tr>
                    </table>
                `;

    document.getElementById("result").innerHTML = table + table1;
  } else {
    alert("Formato de dirección IP no válido.");
  }
});

function isValidIPAddress(ip) {
  const ipreg = /^(\d{1,3}\.){3}\d{1,3}$/;

  if (!ipreg.test(ip)) {
    return false;
  }

  const octets = ip.split(".");
  for (const octet of octets) {
    const num = parseInt(octet, 10);
    if (isNaN(num) || num < 0 || num > 255) {
      return false;
    }
  }

  return true;
}
