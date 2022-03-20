$VPN_CONNECTION_INTERFACE = (Get-NetIpConfiguration |  Where-Object { $_.InterfaceDescription -like "PANGP*"}).InterfaceIndex
$GATEWAY = (Get-NetIpConfiguration |  Where-Object { $_.InterfaceDescription -like "PANGP*"}).IPv4Address.IPAddress

# snížit prioritu VPN 
route CHANGE 0.0.0.0 MASK 0.0.0.0 0.0.0.0 METRIC 50 IF $VPN_CONNECTION_INTERFACE
# nastavit vysokou prioritu pro ejpsrvsqltest01.geis.cz
route delete 192.168.1.48
route add 192.168.1.48 mask 255.255.255.255 $GATEWAY METRIC 20 IF $VPN_CONNECTION_INTERFACE
# nastavit vysokou prioritu pro ejpsrvtfs01.geis.cz
route delete 10.20.230.54
route add 10.20.230.54 mask 255.255.255.255 $GATEWAY METRIC 20 IF $VPN_CONNECTION_INTERFACE
# nastavit vysokou prioritu pro ejpsrvdev01.geis.cz
route delete 192.168.1.54
route add 192.168.1.54 mask 255.255.255.255 $GATEWAY METRIC 20 IF $VPN_CONNECTION_INTERFACE