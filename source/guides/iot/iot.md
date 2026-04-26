---
layout: guide.njk
title: Connectivity in IoT
tag: Guide
---

> **Who this is for:** Engineers, technical founders, and product builders designing IoT devices from scratch, choosing connectivity stacks, or trying to make a deployed fleet behave reliably in the real world.

---

## 1. Framing the Problem

Before you do a single piece of engineering, answer these four questions. They will determine most of your architecture.

**1. How often does your device need to send data, and how much?**

**2. What is the acceptable latency for a command to reach the device?**

**3. What network infrastructure will actually be present at the deployment site?**

**4. What kinds of failures are you willing to accept? Which kinds have to be avoided?**

These four questions will set the parameters for all subsequent engineering decisions by defining a few key metrics: frequency, latency, range, failure & reconnect, power, modulation shema, and the backend. There can be more questions like these, but start here.

For example, a security camera will

  1. send constant video,
  2. where buffering is acceptable,
  3. over WiFi,
  4. and can cut out or lag momentarily, but not to a great extent.

However, a home AC / heating controller needs

  1. only occasional data reporting and instruction fetching,
  2. can accept high latency,
  3. run on WiFi,
  4. but must have a robust fail-safe state, otherwise it could waste money, ruin valuables (like fine art), or lead to health hazards.

These differences should be explored at the very start.

---

## 2. Choosing Your Physical Layer

The radio technology you choose is probably the single most consequential decision you will make. It affects range, power, cost, data rate, and regulatory complexity simultaneously.

### 2.1 Comparison

| Technology | Range | Data Rate | Power | Topology | License Required? |
|---|---|---|---|---|---|
| WiFi ([802.11](https://standards.ieee.org/ieee/802.11/7028/)) | 50–200m | High (Mbps) | High | Star | No (ISM band) |
| Bluetooth LE | 10–100m | Low–Med | Very Low | Star/Mesh | No |
| Zigbee / Thread | 10–100m | Low | Low | Mesh | No |
| Z-Wave | 30–100m | Low | Low | Mesh | No |
| LoRaWAN | 2–15 km | Very Low | Very Low | Star-of-stars | No (ISM) |
| NB-IoT | 1–10 km | Low | Low | Star | Yes (carrier) |
| LTE-M (Cat-M1) | Wide area | Medium | Low | Star | Yes (carrier) |
| LTE Cat-1/4 | Wide area | High | High | Star | Yes (carrier) |
| 5G (mmWave/Sub-6) | Variable | Very High | High | Star | Yes (carrier) |
| Satellite (NTN) | Global | Low | High | Star | Varies |

### 2.2 Which One is Best for You

**WiFi** is appropriate when the device is mains-powered, stationary, and operating in an environment with existing infrastructure. It has the highest power draw of consumer radios, which makes it impractical for devices running on battery power. Its main advantages are high throughput and minimal infrastructure cost.

**Bluetooth LE** is the dominant choice for wearables, handheld medical devices, and anything that pairs to a smartphone. It thrives at low power and handles a sleep/wake cycle easily. Its weaknesses are range and that it shares a frequency band with WiFi.

---
---
---

**LoRaWAN** is underused and underappreciated. For devices that transmit small payloads infrequently (sensor telemetry, asset tracking), it is extraordinarily well-suited: multi-kilometer range, years on a coin cell, and no monthly carrier bill if you run your own gateway. The tradeoff is duty-cycle regulation (typically 1% in the EU under ETSI EN 300 220) and very limited downlink bandwidth. Do not try to stream data over LoRa.

**NB-IoT / LTE-M** are the right answer when you need wide-area coverage, the deployment is cellular-friendly, and a recurring SIM cost is acceptable. LTE-M supports voice and mobility handoff; NB-IoT does not but consumes less power. Both support PSM (Power Saving Mode) and eDRX (extended Discontinuous Reception), which are critical to understand if you care about battery life.

**Cellular (Cat-1 and above)** is appropriate for devices that need meaningful uplink bandwidth and reliable wide-area coverage — think fleet telematics, mobile surveillance, or industrial gateways. The modules are expensive ($15–$60 vs. $2–$8 for LoRa or BLE), and power draw is an order of magnitude higher than LPWAN technologies.

> **Source:** Mekki, K., Bajic, E., Chaxel, F., & Meyer, F. (2019). "A comparative study of LPWAN technologies for large-scale IoT deployment." *ICT Express*, 5(1), 1–7. https://doi.org/10.1016/j.icte.2017.12.005

> **Source:** Semtech. (2020). *LoRa and LoRaWAN: A Technical Overview*. Semtech Application Note AN1200.22. (Available via Semtech's developer portal — covers link budget, spreading factors, and duty cycle comprehensively.)


### 2.3 Antenna Design Is Not Optional

Whatever radio you choose, the antenna is a first-class engineering concern, not an afterthought. A −3 dB loss from a poorly matched or obstructed antenna halves your effective range, or doubles your transmit power requirement for the same coverage. Any project more sophisticated than hobby electronics requires professional design. For embedded antennas:

- **Always follow the module manufacturer's reference layout** for keep-out zones, ground plane cutouts, and feed line geometry.
- **Perform conducted and radiated testing** before finalizing the enclosure design. An enclosure can cause 10–20 dB of attenuation if not designed for RF.
- **For cellular modules**, verify the antenna gain against your link budget at the low end of the band. LTE Band 71 (600 MHz) and Band 28 (700 MHz) have significantly better building penetration than Band 66 (1700/2100 MHz), which matters in deployment environments with walls and metal.
- **For LoRa gateways**, antenna placement is often more impactful than hardware upgrades.

> **Source:** Pozar, D. M. (2011). *Microwave Engineering* (4th ed.). Wiley. (The standard reference for antenna fundamentals. Chapter 5 on impedance matching is directly applicable.)

---

## 3. Choosing Your Application Protocol

The application protocol sits above your radio layer. It defines how your device frames and exchanges messages with a broker or server. The major contenders are:

### 3.1 MQTT

MQTT (Message Queuing Telemetry Transport) is the dominant protocol for IoT telemetry and command. It is a publish-subscribe protocol operating over TCP, designed in the late 1990s for satellite telemetry on unreliable links — a heritage that makes it well-suited to constrained IoT devices.

**Key concepts:**
- **Broker:** A central server (e.g., Mosquitto, HiveMQ, AWS IoT Core) through which all messages pass. Devices do not communicate directly.
- **Topics:** Hierarchical string identifiers for message routing, e.g., `devices/factory-a/sensor-12/temperature`.
- **QoS Levels:**
  - **QoS 0 (At most once):** Fire and forget. No acknowledgment. Fastest, lowest overhead, possible message loss.
  - **QoS 1 (At least once):** Message is acknowledged; will be retransmitted until ACK is received. Possible duplicate delivery.
  - **QoS 2 (Exactly once):** Four-part handshake ensures exactly-once delivery. Highest overhead, use only when duplicate messages would cause real problems (e.g., actuator commands).
- **Retained messages:** The broker stores the last message on a topic and delivers it immediately to new subscribers. Use this for device state.
- **Last Will and Testament (LWT):** A message the broker publishes on the device's behalf if the connection drops unexpectedly. Critical for fleet presence detection.

**When to use MQTT:** Almost always, for telemetry and command, unless a specific constraint rules it out. It is battle-tested, well-supported in every MCU SDK, and has a rich broker ecosystem.

> **Source:** Banks, A., Briggs, E., Borgendale, K., & Gupta, R. (2019). *MQTT Version 5.0*. OASIS Standard. https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html

### 3.2 CoAP

CoAP (Constrained Application Protocol, RFC 7252) is designed for highly constrained devices (think 8 KB RAM, running on UDP). It is RESTful like HTTP but binary and far more compact. Its Observe extension (RFC 7641) allows a server to subscribe to resource updates, enabling push semantics without polling.

**When to use CoAP:** Devices so constrained they cannot maintain a TCP connection, or deployments where UDP is preferred for power reasons (no connection state maintenance). Less ecosystem support than MQTT.

> **Source:** Shelby, Z., Hartke, K., & Bormann, C. (2014). *The Constrained Application Protocol (CoAP)*. RFC 7252. IETF. https://datatracker.ietf.org/doc/html/rfc7252

### 3.3 HTTP/HTTPS

REST over HTTP is familiar to every backend developer and has universal infrastructure support. For IoT, it is generally a poor fit as a primary device-to-cloud protocol because:
- Every request requires a full TCP handshake (and TLS negotiation) unless keep-alive is configured.
- There is no native push/subscribe — you must either poll or use SSE/WebSockets.
- Overhead per message is high relative to MQTT.

**When to use HTTP:** Devices that communicate infrequently (once per hour or less) and where engineering simplicity outweighs efficiency. Also common for device provisioning and OTA endpoints even on MQTT-primary devices.

### 3.4 AMQP

AMQP 1.0 is a rich, broker-agnostic messaging protocol with strong enterprise support (Azure IoT Hub uses it as a transport option). It is more complex to implement than MQTT and not well-supported in embedded SDKs, but worth knowing if you are deploying into an enterprise environment with existing AMQP infrastructure.

### 3.5 Protocol Decision Summary

For most new IoT products: **use MQTT over TLS (port 8883)**. It is the right default. Graduate to CoAP only when you hit genuine memory or power constraints that MQTT cannot satisfy. Add HTTP only where you need it (provisioning, OTA, human-facing APIs).

---

## 4. Connection Lifecycle Management

How your device manages its connection is often where the gap between "works in the lab" and "works in the field" lives.

### 4.1 The Connection State Machine

Model your device's connectivity as an explicit state machine with well-defined transitions. At minimum:

```
DISCONNECTED → CONNECTING → CONNECTED → DISCONNECTING → DISCONNECTED
                    ↓
               BACKOFF_WAIT
```

Every state should have a timeout. `CONNECTING` should not wait indefinitely — if a connection attempt has not succeeded within a defined window (e.g., 30 seconds), fail it and enter `BACKOFF_WAIT`.

### 4.2 Exponential Backoff with Jitter

When a connection fails, do not immediately retry. Repeated hammering of a broker or cellular network under failure conditions can turn an infrastructure hiccup into an outage.

The standard pattern is **exponential backoff with full jitter**:

```
wait_seconds = random(0, min(cap, base * 2^attempt))
```

Where `base` is your initial delay (e.g., 1 second), `cap` is your maximum delay (e.g., 300 seconds), and `attempt` is the number of consecutive failures.

The randomization ("jitter") is not decorative. When a broker restarts and 10,000 devices reconnect simultaneously, a synchronized reconnect storm can immediately crash it again. Full jitter distributes that reconnect load across the cap window.

> **Source:** Brooker, M. (2015). *Exponential Backoff and Jitter*. AWS Architecture Blog. https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/ (This is the canonical treatment of the topic; the math is sound and directly applicable to IoT fleets.)

### 4.3 Keep-Alive and PING

TCP connections through NAT and firewalls can be silently dropped by middleboxes that expire idle connection entries. The MQTT `KEEPALIVE` parameter (set during CONNECT) tells the broker the maximum interval between communications. If the broker does not hear from the client within 1.5× the keepalive value, it considers the client disconnected and publishes the LWT.

**Practical values:**
- On cellular networks: 60–120 seconds. Many carrier NAT tables have idle timeouts of 60–90 seconds; a keepalive below that prevents silent disconnection.
- On WiFi: 120–300 seconds is typically safe.
- On LoRaWAN: the concept does not apply at the application layer — keepalive is handled by the network infrastructure.

The broker side of PING is equally important. Your device should detect broker-side silence (no PINGRESP received) and treat it as a connection failure.

### 4.4 Clean vs. Persistent Sessions

MQTT offers a **Clean Session** flag. When set to true, the broker discards all session state (subscriptions, queued QoS 1/2 messages) on disconnect. When set to false (persistent session), the broker queues messages published to the device's subscribed topics while it is offline and delivers them on reconnect.

For most telemetry devices, clean sessions are fine — stale sensor readings from hours ago are not useful. For command-and-control (e.g., a firmware update trigger), persistent sessions ensure the command is not lost if the device is briefly offline when it is sent.

---

## 5. Heartbeats, Telemetry, and Data Pacing

### 5.1 Heartbeats vs. Data Messages

Distinguish between two types of device-to-cloud messages:

- **Heartbeat / presence ping:** A lightweight message whose primary purpose is to prove the device is alive and reachable. Contains minimal payload (timestamp, firmware version, perhaps a signal quality indicator).
- **Telemetry message:** A message whose purpose is to deliver measured data. May be triggered by a timer, an event, or a threshold crossing.

Do not conflate these. A heartbeat can be very frequent; a telemetry message should be sized and paced by how often the data actually changes meaningfully.

### 5.2 Sampling Rate vs. Reporting Rate

These are different things and should be configured independently when possible.

- **Sampling rate:** How often the MCU reads the sensor.
- **Reporting rate:** How often the device sends data to the cloud.

You can sample at 10 Hz, compute a 1-minute rolling average, and report once per minute. This preserves signal fidelity for local logic while dramatically reducing network overhead and cost. On cellular networks, data cost is real; on LoRaWAN, you are constrained by duty cycle regulations.

### 5.3 Event-Driven vs. Periodic Reporting

Periodic reporting (report every N seconds regardless of change) is simple and predictable. Event-driven reporting (report when a threshold is crossed or a meaningful change occurs) is more efficient but harder to implement correctly.

A practical hybrid: **report on change, with a minimum interval and a maximum interval**. If the value changes, report immediately (subject to a debounce). If the value has not changed, report anyway after the maximum interval as a heartbeat. This pattern handles both the "nothing is happening" and "something just happened" cases efficiently.

### 5.4 Payload Design

Keep payloads as small as practical. This matters for cellular data costs, LoRaWAN duty cycle compliance, and power consumption (transmit time proportional to payload size on most radios).

- **Avoid JSON for heavily constrained devices.** JSON is human-readable but has significant framing overhead. A 4-byte float becomes `{"temperature":23.45}` — 21 bytes, 5.25× overhead.
- **Use binary packing or CBOR** (Concise Binary Object Representation, RFC 7049) for constrained environments. CBOR is schema-flexible like JSON but binary.
- **Use Protocol Buffers (protobuf)** if you have more processing headroom and want a schema-enforced, strongly-typed binary format with excellent tooling.
- **If you use JSON**, at least strip unnecessary whitespace and use short key names.

> **Source:** Bormann, C., & Hoffman, P. (2013). *Concise Binary Object Representation (CBOR)*. RFC 7049. IETF. https://datatracker.ietf.org/doc/html/rfc7049

---

## 6. Reliability Patterns: Handling Disconnection Gracefully

Your device will be offline. Plan for it from day one.

### 6.1 Store-and-Forward

If your data is important enough to not lose, implement local storage with a forward queue:

1. Incoming sensor readings are written to local non-volatile storage (flash, EEPROM, SD card) as they are generated.
2. A separate task reads from the queue and attempts to publish.
3. On successful publish + acknowledgment, the entry is removed from the queue.
4. On disconnect, the queue continues to fill; on reconnect, it drains.

The queue needs a **maximum size policy**. When storage is full, you must decide: drop oldest entries (common for telemetry), drop newest (rare), or halt sensing. Define this explicitly — undefined behavior here will cause real data loss.

Filesystem options on embedded systems:
- **LittleFS** is the modern choice for NOR flash on MCUs: wear-leveling, power-loss resilient, small footprint.
- **SPIFFS** is older and has known power-loss issues; prefer LittleFS.
- **FatFS** is appropriate when an SD card is involved and interoperability with host OSes matters.

> **Source:** Mital, A. (2023). *LittleFS: A little fail-safe filesystem designed for microcontrollers*. GitHub/ARM-Software. https://github.com/littlefs-project/littlefs (The design doc in the repository is an excellent read on wear-leveling and power-loss safety for constrained flash.)

### 6.2 Sequence Numbers and Timestamps

Always timestamp data at the point of collection, not at the point of transmission. If a device reconnects after 6 hours offline and dumps 360 minutes of stored readings, the server needs to know each reading's actual collection time — not the time it was received.

Add a monotonic sequence number to messages. This allows the backend to:
- Detect gaps in the sequence (data was lost before it could be stored)
- Deduplicate messages delivered more than once under QoS 1
- Reconstruct correct ordering even if messages arrive out-of-order

### 6.3 Idempotency

Design your server-side message handlers to be idempotent — processing the same message twice produces the same result as processing it once. This is mandatory for QoS 1 (at-least-once) delivery. Use the sequence number or a UUID as a deduplication key.

---

## 7. Security from the Wire Up

IoT security failures are not hypothetical. The Mirai botnet (2016) compromised over 600,000 IoT devices by exploiting default credentials and lack of network isolation. These are not advanced attacks.

### 7.1 Transport Security

**All device-to-cloud communication should use TLS 1.2 or 1.3.** This applies to MQTT, HTTP, AMQP, and any other protocol carrying real data. TLS 1.0 and 1.1 are deprecated; do not use them.

On constrained devices, TLS has real costs: mbedTLS (the most common embedded TLS library) requires roughly 50–80 KB of ROM and at minimum 10–20 KB of heap for a TLS session. If your device cannot support this, consider a gateway architecture where a capable gateway handles TLS termination and the device communicates over a local protocol.

> **Source:** Rescorla, E. (2018). *The Transport Layer Security (TLS) Protocol Version 1.3*. RFC 8446. IETF. https://datatracker.ietf.org/doc/html/rfc8446

### 7.2 Device Authentication

There are three meaningful options, in increasing order of security:

**Pre-shared keys (PSK-TLS):** A shared secret is provisioned at manufacture. Simpler than certificate management, but all devices share the same secret (or per-device secrets that must be managed). PSK-TLS is supported in mbedTLS and most embedded TLS stacks.

**X.509 client certificates:** Each device has a unique private key and certificate. The server validates the certificate against a trusted CA. This is the model used by AWS IoT Core, Azure IoT Hub, and Google Cloud IoT. It scales well — revoking a single device does not affect others. The private key must be generated and stored securely (see below).

**Token-based (JWT, SAS):** Tokens are issued by the server and expire. Used by Google Cloud IoT and Azure IoT Hub as an alternative to certificates. Simpler to implement, but tokens must be refreshed, which introduces its own complexity.

**For most production deployments: use X.509 client certificates.** The infrastructure overhead is worth it.

### 7.3 Secrets and Key Storage

Never hardcode credentials in firmware. Never store them in unprotected flash where they can be read via JTAG.

- **Use the device's hardware security features.** ESP32 has eFuse-based secure boot and flash encryption. STM32 has a read-protected option byte. nRF52 has APPROTECT. Enable these.
- **Use an external secure element** (ATECC608, OPTIGA Trust M, SE050) when the application justifies it. The private key never leaves the secure element; the MCU sends a digest, the secure element signs it. Defeat via physical probing is made significantly harder.
- **Generate keys on-device**, not off-device. A key generated on a factory server and then flashed has been exposed in transit. A key generated on the secure element has never existed anywhere else.

> **Source:** Schneier, B. (2015). *Secrets and Lies: Digital Security in a Networked World* (Anniversary ed.). Wiley. (Still the best conceptual introduction to threat modeling and security design philosophy. Chapter 2 on attackers is foundational.)

### 7.4 Principle of Least Privilege

Each device should only be able to publish to its own topics and subscribe to topics addressed to it. It should not be able to read other devices' data. On MQTT brokers, enforce this through per-device ACLs.

On AWS IoT Core, this is done through IoT Policies attached to the certificate. A minimal policy looks like:

```json
{
  "Effect": "Allow",
  "Action": ["iot:Publish"],
  "Resource": "arn:aws:iot:REGION:ACCOUNT:topic/devices/${iot:ClientId}/*"
}
```

The `${iot:ClientId}` substitution ensures the policy is scoped to that device only.

### 7.5 Network Segmentation

IoT devices should not be on the same network segment as enterprise IT infrastructure. They represent a distinct trust boundary. Use VLANs, separate SSIDs, or cellular APNs to enforce this isolation. A compromised thermostat should not be a pivot point to the corporate file server.

---

## 8. Device Provisioning and Identity

Provisioning is the process by which a factory-fresh device acquires its identity, credentials, and configuration to join your fleet. It is unglamorous and frequently under-designed.

### 8.1 What Needs to Be Provisioned

- A unique device identifier (should be derived from or tied to a hardware identifier, e.g., MAC address, eFuse ID, or serial number burned at manufacture)
- Cryptographic credentials (private key + certificate, or a shared secret)
- Initial configuration (server endpoint, reporting interval, feature flags)
- Firmware version baseline

### 8.2 Provisioning Methods

**Hard-coded at manufacture:** Credentials burned into flash during production programming. Simple, but requires a secure manufacturing environment. If the production programmer is compromised, all devices in that run are compromised.

**Certificate injection via secure provisioning station:** Devices connect to a dedicated provisioning server at the end of the production line. The server generates and injects a unique certificate per device and registers it in your IoT platform. This is the production-grade approach for most commercial deployments.

**Bootstrap / fleet provisioning:** Devices ship with a bootstrap certificate that has very limited permissions — only the ability to call a `RegisterThing` API endpoint. On first boot, the device calls this endpoint, which creates a permanent certificate and returns it to the device. AWS IoT Fleet Provisioning and Azure DPS implement this model.

**Onboarding via mobile app (consumer devices):** A BLE-based provisioning flow where the user's phone configures the device's WiFi credentials and cloud registration. Apple's MFi HomeKit provisioning and Matter's commissioning flow are examples. This shifts the provisioning burden to the end user, which has UX implications.

> **Source:** Khan, R., Khan, S. U., Zaheer, R., & Khan, S. (2012). "Future Internet: The Internet of Things Architecture, Possible Applications and Key Challenges." *10th International Conference on Frontiers of Information Technology (FIT)*. IEEE. (Good survey of provisioning and identity management approaches at scale.)

---

## 9. OTA Updates

If you cannot update firmware remotely, you cannot fix bugs in the field. OTA (Over-The-Air) update capability is not a feature — it is an operational requirement.

### 9.1 Partition Layout for OTA

Plan your flash partition layout before you write your bootloader. The standard approach is a dual-bank (A/B) layout:

```
[ Bootloader ] [ Factory/Recovery ] [ OTA Slot A ] [ OTA Slot B ] [ Data/NVS ]
```

The device runs from Slot A. An update writes to Slot B. The bootloader, on next reset, validates Slot B and boots from it. If validation fails (bad hash, first-boot watchdog trigger), it rolls back to Slot A. **This rollback mechanism must be tested explicitly.** A failed OTA that bricks a deployed device is a catastrophic field event.

ESP-IDF's OTA implementation uses exactly this pattern and is a good reference. The ESP32 Arduino core exposes it via the `Update` library.

### 9.2 Update Integrity and Authenticity

Every update package must be:
- **Integrity-checked:** SHA-256 hash of the binary, verified before the bootloader commits to the new partition.
- **Authenticity-verified:** The firmware image should be signed with a private key held by your build system. The device verifies the signature against a public key stored in protected flash. This prevents an attacker who gains access to your update delivery mechanism from pushing malicious firmware.

> **Source:** European Union Agency for Cybersecurity (ENISA). (2020). *Guidelines for Securing the Internet of Things: Security in the IoT Lifecycle*. ENISA. https://www.enisa.europa.eu/publications/guidelines-for-securing-the-internet-of-things (Section 4 covers OTA security requirements comprehensively.)

### 9.3 Update Delivery

- **Staged rollouts:** Do not push an update to 100% of your fleet simultaneously. Push to 1%, monitor error rates and heartbeat patterns for 24–48 hours, then expand. One bad firmware update can brick a fleet.
- **Delta updates:** For bandwidth-constrained deployments (LoRaWAN, metered cellular), transmitting only the diff between firmware versions is substantially more efficient. Tools like `bsdiff` and `janpatch` support this on embedded targets.
- **HTTPS only for update delivery.** The download URL for a firmware binary should be served over HTTPS, and the binary must be signature-verified even if the transport is trusted.

---

## 10. Power and Connectivity Trade-offs

Connectivity is the largest single contributor to power consumption on most battery-operated IoT devices. This section is primarily relevant for battery-operated devices; mains-powered devices can treat power as abundant.

### 10.1 The Fundamental Trade-off

Radios are power-hungry in two modes:
- **Transmit (TX):** Highest current draw; 10–400 mA depending on power class and technology.
- **Receive (RX):** Moderate current draw; the radio is listening but not transmitting. Often underestimated.
- **Sleep:** Minimal current; µA range. This is where your device should spend most of its time.

The goal is to minimize time in TX and RX, maximize time in sleep.

### 10.2 Cellular Power-Saving Features

**PSM (Power Saving Mode):** The device tells the network it will be unreachable for a period (T3412 timer, configurable from minutes to hours). During PSM, the device is completely unreachable — no downlink possible. On wake, it re-attaches without a full network registration. Saves significant power when you have periodic-only uplink requirements.

**eDRX (extended Discontinuous Reception):** The device sleeps between paging windows. Unlike PSM, the device remains reachable (downlink possible) but only wakes to check for pages on a configurable interval (2.56 seconds to 40+ minutes). Balances reachability with power savings.

The AT command interface to configure these varies by module. For Quectel modules (common in the field):
```
AT+CPSMS=1,,,"10100011","00000001"  # Enable PSM with T3412=1h, T3324=2s
AT+CEDRXS=2,4,"0101"               # Enable eDRX for NB-IoT, 81.92s cycle
```

Verify with your specific module documentation; timer encoding is bitmask-based and non-obvious.

> **Source:** 3GPP. (2020). *TS 23.682: Architecture enhancements to facilitate communications with packet data networks and applications*. 3rd Generation Partnership Project. (Defines PSM and eDRX behaviors at the standard level.)

### 10.3 Current Budget Analysis

Build a current budget early in the design. For a device that wakes, connects, transmits, and sleeps:

```
Energy = (I_sleep × T_sleep) + (I_radio_on × T_radio_on) + (I_tx × T_tx)
```

Model this in a spreadsheet. Then compare against your battery capacity (mAh) divided by average current to get estimated battery life. Do this before you commit to a radio technology. Tools like Nordic's [Online Power Profiler](https://devzone.nordicsemi.com/power/w/opp/2/online-power-profiler) make this concrete for BLE.

### 10.4 WiFi Power Management

WiFi has the worst power profile of common IoT radios, but it supports Power Save Mode (802.11 PS-Poll and DTIM beacons). A device in 802.11 sleep mode wakes on DTIM intervals (configurable, typically 100ms to 1s) to check for buffered frames. In deep sleep between reports, the WiFi radio can be fully powered off, requiring re-association on wake. This adds 1–3 seconds of latency per wake cycle but saves significant power.

---

## 11. Cloud Backend Considerations

The device is half the problem. The backend that receives, stores, and acts on device data is the other half.

### 11.1 Managed IoT Platforms vs. Roll Your Own

For early-stage startups, the decision between a managed IoT platform (AWS IoT Core, Azure IoT Hub, Google Cloud IoT) and a self-hosted stack (Mosquitto + TimescaleDB + custom API) is primarily a trade-off between operational overhead and cost.

**Managed platforms** handle broker scaling, certificate management, device registry, and shadow state automatically. AWS IoT Core, for example, scales to billions of messages and millions of devices. You pay per message and per connection. At early scale this is economical; at very high message volume it becomes expensive.

**Self-hosted** (e.g., HiveMQ, EMQX, or VerneMQ for the broker layer) gives you cost control at scale and avoids vendor lock-in, but requires you to operate the broker infrastructure, manage certificates, implement device registry, and handle scaling yourself. This is a reasonable choice when you have the operational capability.

A pragmatic path: start with a managed platform to validate the product, architect with abstraction layers so that swapping the broker is a configuration change, and re-evaluate at scale.

### 11.2 Device Shadow / Digital Twin

Most managed IoT platforms offer a device shadow (AWS) or device twin (Azure) — a JSON document in the cloud that represents the last known state of the device and the desired state. This solves a common problem: what happens when you want to change a device setting but the device is offline?

The shadow pattern:
1. Backend writes `{"desired": {"reporting_interval": 60}}` to the shadow.
2. Device connects and receives a delta — the difference between reported and desired state.
3. Device applies the configuration change and writes `{"reported": {"reporting_interval": 60}}` to confirm.
4. Delta is now empty; the shadow is in sync.

Implement this pattern even if you build your own backend. It handles offline command delivery elegantly without requiring persistent sessions for every device.

### 11.3 Time Series Storage

Sensor data is time series data. Do not store it in a relational database with a naive schema like `INSERT INTO readings (device_id, timestamp, value)`. At scale, this becomes extremely slow for range queries.

Purpose-built time series databases are dramatically more efficient:
- **TimescaleDB** (PostgreSQL extension): Familiar SQL interface, excellent compression, good for teams that know Postgres.
- **InfluxDB**: Popular in the IoT/monitoring space, purpose-built for time series, has a native query language (Flux).
- **QuestDB**: High-performance, columnar storage, SQL interface.
- **Amazon Timestream, Azure Data Explorer**: Managed options with deep cloud integration.

> **Source:** Jensen, S. K., Pedersen, T. B., & Thomsen, C. (2010). "Time Series Management Systems: A Survey." *IEEE Transactions on Knowledge and Data Engineering*, 29(11), 2580–2601. (Survey paper on time series storage architecture patterns.)

---

## 12. Testing and Observability

### 12.1 Test for Disconnection

The most common gap in IoT device testing is the failure to test disconnection scenarios. Your device will encounter:
- Dropped WiFi / cellular signal mid-transmission
- Broker restarts
- Network partition (device can transmit but not receive, or vice versa)
- Corrupt packets causing TLS session failure
- Clock skew causing TLS certificate validation failures

Use a network emulator (Linux `tc netem`, Comcast by Shopify, or physical RF attenuation) to simulate packet loss, latency, and disconnection in your test harness. Test reconnection and store-and-forward behavior explicitly.

### 12.2 What to Log and Expose

At minimum, every device in your fleet should periodically report:
- **RSSI / SINR / SNR** (signal quality of the radio link)
- **Connection duration** (how long the current session has been up)
- **Reconnect count** (how many times the device has reconnected since last boot)
- **Queue depth** (how many messages are waiting to be transmitted)
- **Firmware version**
- **Free heap / memory** (early indicator of memory leaks)
- **Uptime / reset reason** (what caused the last reboot: watchdog, panic, power cycle)

This data is your remote diagnostic capability. Without it, debugging a fleet problem is nearly impossible.

### 12.3 Watchdog Timers

Enable the hardware watchdog on your MCU. Configure it to reset the device if the main loop has not checked in within a reasonable interval (e.g., 30 seconds). Ensure your connectivity stack kicks the watchdog. A device stuck in an infinite retry loop or deadlocked on a mutex will be recovered automatically.

Additionally, implement a software-level connectivity watchdog: if the device has not successfully published a message in N minutes, force a full reconnect (or reboot). This catches TLS session corruption and other stuck states that the MQTT keep-alive mechanism misses.

---

## 13. Further Reading by Topic

> **Source:** Rowland, C., Goodman, E., Charlier, M., Light, A., & Lui, A. (2015). *Designing Connected Products: UX for the Consumer Internet of Things*. O'Reilly Media. (Chapters 2–3 provide an excellent framing of the "constraints before solutions" methodology.)

### Connectivity Fundamentals
- Rowland, C. et al. (2015). *Designing Connected Products*. O'Reilly. — Best single book for IoT product design holistically.
- Hanes, D., Salgueiro, G., Grossetete, P., Barton, R., & Henry, J. (2017). *IoT Fundamentals: Networking Technologies, Protocols, and Use Cases for the Internet of Things*. Cisco Press.
- Kranz, M. (2016). *Building the Internet of Things*. Wiley.

### MQTT and Messaging
- OASIS MQTT v5.0 Specification. https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html
- Hillar, G. C. (2017). *MQTT Essentials: A Lightweight IoT Protocol*. Packt Publishing.
- HiveMQ MQTT Essentials blog series. https://www.hivemq.com/mqtt-essentials/ — Well-written, practical, free.

### LPWAN and Radio
- Mekki, K. et al. (2019). "A comparative study of LPWAN technologies." *ICT Express*.
- Lora Alliance. *LoRaWAN Specification v1.0.4*. https://lora-alliance.org/resource_hub/lorawan-specification-v1-0-4/
- Sornin, N. et al. (2015). *LoRaWAN Specification*. LoRa Alliance Technical Committee.

### Security
- ENISA. (2020). *Guidelines for Securing the Internet of Things*. https://www.enisa.europa.eu/publications/guidelines-for-securing-the-internet-of-things
- NIST. (2019). *Considerations for Managing IoT Cybersecurity and Privacy Risks* (NISTIR 8228). https://nvlpubs.nist.gov/nistpubs/ir/2019/NIST.IR.8228.pdf
- OWASP IoT Project. *IoT Attack Surface Areas*. https://owasp.org/www-project-internet-of-things/

### Embedded Systems and Firmware
- White, E. (2011). *Making Embedded Systems: Design Patterns for Great Software*. O'Reilly. — Excellent on state machines, watchdogs, and embedded architecture.
- Valvano, J. W. (2014). *Embedded Systems: Real-Time Interfacing to ARM Cortex-M Microcontrollers*. CreateSpace.

### Power Management
- Nordic Semiconductor. *nRF Power Profiler Kit II*. https://www.nordicsemi.com/Products/Development-hardware/Power-Profiler-Kit-2 — Hardware tool for measuring actual current draw.
- Microchip / Atmel. *AVR4013: picoPower Basics*. Application Note. — The principles generalize beyond AVR.

### Cloud and Backend
- AWS IoT Core Developer Guide. https://docs.aws.amazon.com/iot/latest/developerguide/
- Azure IoT Hub Developer Guide. https://learn.microsoft.com/en-us/azure/iot-hub/
- TimescaleDB Documentation: *Time-Series Data*. https://docs.timescale.com/

---

*This guide is a living reference. The IoT landscape evolves quickly — protocol versions, certification requirements, and cloud platform features change. When in doubt, go to the primary specification documents and official platform documentation rather than third-party tutorials, which date quickly.*

---
*Prepared April 2026.*
