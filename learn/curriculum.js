/*
 * Curriculum derived from "How to Become a Robotics Engineer" (Technologiee, Substack).
 * https://technologiee.substack.com/p/how-to-become-a-robotics-engineer
 *
 * Module format: [title, goal, [tasks], [resources], estimatedHours]
 * Resource format: "Label|https://url"  -> direct link
 *                  "Label"              -> web-search link (used when no stable URL is known)
 * The 5th module of every week is the "Build" day that ships that week's capstone.
 * Prices come from the article (verified Sept 2026) and may have changed.
 */
window.CURRICULUM = {
  title: "Robotics Engineer Path",
  source: "https://technologiee.substack.com/p/how-to-become-a-robotics-engineer",
  months: [
    /* ------------------------------------------------------------------ MONTH 1 */
    {
      title: "Electronics, Bench Tools & Foundations",
      short: "Electronics",
      outcome: "Read schematics, solder cleanly, and be comfortable with Python, the terminal and Git.",
      budget: "$45-60 starter  ·  $200-300 full bench",
      gear: [
        ["Elegoo UNO Super Starter Kit", "$42.99", "Arduino-compatible board + parts"],
        ["Adafruit 9205B+ multimeter", "$17.50", "Continuity, voltage, current"],
        ["Pinecil V2 soldering iron", "$25.99-35.99", "USB-C powered, great value"],
        ["SparkFun Inventor's Kit", "$99.95", "Optional premium starter"],
        ["Make: Electronics, 3rd Ed.", "$29.99", "Optional hands-on book"]
      ],
      weeks: [
        {
          title: "Electronics Fundamentals",
          days: [
            ["Voltage, Current & Ohm's Law", "Build intuition for how electricity behaves so every later circuit makes sense.",
              ["Read All About Circuits Vol. 1, chapters 1-2", "Simulate a battery + resistor in Falstad and sweep the resistance", "Hand-calculate V, I and power (P = VI) for 5 example circuits", "Write 5 flashcards: V, I, R, P and what 'ground' means"],
              ["Falstad Circuit Simulator|https://www.falstad.com/circuit/", "All About Circuits textbook|https://www.allaboutcircuits.com/textbook/", "Afrotechmods electronics tutorials"], 2.5],
            ["Voltage Dividers, Series & Parallel", "Learn the single most reused circuit in robotics.",
              ["Derive Vout = Vin x R2 / (R1 + R2)", "Simulate a divider that turns 5 V into 3.3 V", "Compute equivalent resistance for series/parallel networks", "Observe the 'loading' effect by adding a load resistor"],
              ["Falstad Circuit Simulator|https://www.falstad.com/circuit/", "All About Circuits: Divider Circuits|https://www.allaboutcircuits.com/textbook/direct-current/chpt-6/"], 2],
            ["Capacitors, Pull-ups & Decoupling", "Understand the 'boring' parts that keep microcontrollers stable.",
              ["Simulate RC charge/discharge and measure the time constant", "Explain why decoupling caps sit right next to IC power pins", "Wire a button with pull-up and pull-down resistors in Tinkercad", "Note what a 'floating' input does"],
              ["Tinkercad Circuits|https://www.tinkercad.com/circuits", "All About Circuits Vol. 1 (capacitors)|https://www.allaboutcircuits.com/textbook/", "Afrotechmods pull-up resistor"], 2.5],
            ["Transistors, Batteries & Power Budgets", "Switch real loads from logic pins and avoid brown-outs.",
              ["Learn NPN and MOSFET switching, base/gate resistors, flyback diodes", "Read LiPo basics: cell voltage range, safe charging, never over-discharge", "Add up the current draw of a small robot to size a battery", "Define 'brown-out' in your own words and how to prevent it"],
              ["All About Circuits: Transistors|https://www.allaboutcircuits.com/textbook/semiconductors/", "LiPo battery safety guide", "Falstad Circuit Simulator|https://www.falstad.com/circuit/"], 2.5],
            ["BUILD: Divider + Transistor Switch", "Ship the first two capstones of the roadmap.",
              ["Calculate a voltage divider and confirm it in simulation", "Build a logic-level transistor switch (LED or small motor) in Tinkercad", "Screenshot both and upload them below", "Write 3 lines on what surprised you"],
              ["Tinkercad Circuits|https://www.tinkercad.com/circuits", "Falstad Circuit Simulator|https://www.falstad.com/circuit/"], 3]
          ]
        },
        {
          title: "Bench Tools & Soldering",
          days: [
            ["Bench Setup & the Multimeter", "Set up a safe workspace and measure like an engineer.",
              ["Buy or gather: multimeter, iron, solder, helping hands, safety glasses", "Practice continuity, DC voltage and resistance measurements", "Measure a battery under no load and under load", "Learn why current is measured in series"],
              ["SparkFun: How to Use a Multimeter|https://learn.sparkfun.com/tutorials/how-to-use-a-multimeter", "Adafruit multimeter guide"], 2],
            ["Schematics & Datasheets", "Be able to read the two documents every hardware job runs on.",
              ["Learn the common schematic symbols and net labels", "Open the ESP32 or Arduino UNO schematic and trace the power path", "Find absolute max ratings and pinout in a datasheet", "Pick a servo and list its voltage, stall current and pulse range"],
              ["Arduino UNO R3 schematic|https://docs.arduino.cc/hardware/uno-rev3/", "How to read a datasheet"], 2],
            ["Soldering Theory", "Understand what a good joint is before touching the iron.",
              ["Read the Adafruit Excellent Soldering Guide", "Learn tinning, flux and temperature settings", "Study photos of good vs cold joints", "Prepare scrap boards and header pins"],
              ["Adafruit Excellent Soldering Guide|https://learn.adafruit.com/adafruit-guide-excellent-soldering", "EEVblog soldering tutorial"], 1.5],
            ["Soldering Practice", "Repeat until clean joints become muscle memory.",
              ["Solder 20+ joints on a practice board", "Solder a header onto a breakout board", "Desolder one joint with wick or a pump", "Inspect each joint and note flaws"],
              ["Adafruit Excellent Soldering Guide|https://learn.adafruit.com/adafruit-guide-excellent-soldering", "Pinecil soldering tips"], 2.5],
            ["BUILD: Soldered Headers, Verified", "Prove your joints electrically, not just visually.",
              ["Solder header pins onto a board", "Use continuity mode to check every pin and test for shorts between neighbours", "Photograph the result (upload below)", "Log any joints you had to redo"],
              ["SparkFun: How to Use a Multimeter|https://learn.sparkfun.com/tutorials/how-to-use-a-multimeter"], 2]
          ]
        },
        {
          title: "Python & the Terminal",
          days: [
            ["Python I: Functions, Conditionals, Loops", "Get fluent in the language most robotics glue code uses.",
              ["Start CS50P lectures 0-2 (functions, conditionals, loops)", "Do the matching problem sets", "Write a function that converts an ADC reading to volts", "Keep every solution in one Git folder"],
              ["CS50P (Harvard)|https://cs50.harvard.edu/python/", "Python for Everybody (Coursera)|https://www.coursera.org/specializations/python"], 3],
            ["Python II: Data, Files & Exceptions", "Handle sensor-style data the way real scripts do.",
              ["CS50P lectures 3-5 (exceptions, libraries, unit tests)", "Parse a CSV of fake sensor readings", "Write 3 pytest unit tests", "Handle a missing file gracefully"],
              ["CS50P (Harvard)|https://cs50.harvard.edu/python/", "pytest documentation|https://docs.pytest.org/"], 3],
            ["Python III: Classes & Packages", "Model robot parts as objects and manage dependencies.",
              ["CS50P lectures 6-8 (file I/O, regex, OOP)", "Create a Motor class with speed and direction", "Create a virtual environment and install a package with pip", "Learn what requirements.txt is for"],
              ["CS50P (Harvard)|https://cs50.harvard.edu/python/", "Python venv tutorial|https://docs.python.org/3/tutorial/venv.html"], 3],
            ["The Terminal & Shell Scripting", "Stop being afraid of the command line. ROS lives there.",
              ["Missing Semester: Course overview + the shell", "Missing Semester: Shell tools and scripting", "Write a bash script that renames and archives files", "Practice grep, find, pipes and redirection"],
              ["The Missing Semester (MIT)|https://missing.csail.mit.edu/", "Explainshell|https://explainshell.com/"], 2.5],
            ["BUILD: Python Tool on GitHub", "Ship your first portfolio-quality repo.",
              ["Write a small CLI tool (e.g. log analyser or unit converter)", "Add a README with usage and examples", "Add at least 3 tests", "Create the GitHub repo and push the code"],
              ["GitHub Docs: Create a repo|https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories"], 3]
          ]
        },
        {
          title: "Git & Month 1 Consolidation",
          days: [
            ["Git Fundamentals", "Version control is a non-negotiable job skill.",
              ["Complete the first half of Learn Git Branching", "Practice init, add, commit, status, log, diff", "Write 3 good commit messages", "Add a .gitignore"],
              ["Learn Git Branching|https://learngitbranching.js.org/", "Pro Git book|https://git-scm.com/book/en/v2"], 2],
            ["Branching, Merging & Remotes", "Work with branches and GitHub like a collaborator.",
              ["Finish Learn Git Branching main levels", "Create a branch, make a change, open and merge a pull request on your own repo", "Resolve one deliberate merge conflict", "Learn rebase vs merge at a high level"],
              ["Learn Git Branching|https://learngitbranching.js.org/", "GitHub flow|https://docs.github.com/en/get-started/using-github/github-flow"], 2.5],
            ["Automation & Editors", "Make your tooling fast.",
              ["Missing Semester: Editors (Vim basics) and Data wrangling", "Learn 10 useful VS Code shortcuts", "Write a Makefile or shell alias to run your tests", "Set up SSH keys for GitHub"],
              ["The Missing Semester (MIT)|https://missing.csail.mit.edu/", "GitHub SSH keys|https://docs.github.com/en/authentication/connecting-to-github-with-ssh"], 2],
            ["Month 1 Review & Gaps", "Find and fix weak spots before moving on.",
              ["Redo one circuit from memory without notes", "Quiz yourself on your flashcards", "List 3 concepts you are still shaky on and revisit them", "Re-solder one joint you were unhappy with"],
              ["Falstad Circuit Simulator|https://www.falstad.com/circuit/", "All About Circuits textbook|https://www.allaboutcircuits.com/textbook/"], 2],
            ["BUILD: Month 1 Wrap-up & Retro", "Close the month with proof of work.",
              ["Make sure all 5 Month 1 capstones are uploaded or linked", "Pin your Python repo on your GitHub profile", "Write a one-page retrospective in your notes", "Order Month 2 parts (ESP32, drivers, sensors)"],
              ["Source article: roadmap overview|https://technologiee.substack.com/p/how-to-become-a-robotics-engineer"], 2]
          ]
        }
      ]
    },
    /* ------------------------------------------------------------------ MONTH 2 */
    {
      title: "Microcontrollers, Motors & First Moving Robots",
      short: "Microcontrollers",
      outcome: "Two working robots: a PD line follower and an IMU-stabilised build, with encoder-controlled motors.",
      budget: "$38-105 line follower  ·  $62-134 balancer",
      gear: [
        ["ESP32-S3 dev board", "$15.95", "Classic ESP32 ~$15, XIAO C3 $4.99"],
        ["DRV8833 motor driver", "$5.95", "Cheapest viable"],
        ["TB6612FNG motor driver", "$14.77", "The correct L298N replacement"],
        ["Pololu gearmotor + encoder", "$19.95 ea", "Need two for a rover"],
        ["HC-SR04 ultrasonic", "$3.95", "Cheap distance sensing"],
        ["VL53L0X time-of-flight", "$14.95", "Better short-range sensor"],
        ["MPU-6050 IMU", "$12.95", "Gyro + accelerometer"],
        ["BNO085 IMU", "$29.50", "Optional: fusion on-chip"]
      ],
      weeks: [
        {
          title: "Arduino Essentials",
          days: [
            ["Arduino Setup & Digital I/O", "Get code running on real hardware.",
              ["Install the Arduino IDE and upload Blink", "Read a button with digitalRead and drive an LED", "Use INPUT_PULLUP and explain why it works", "Do Paul McWhorter lessons 1-5"],
              ["Paul McWhorter Arduino lessons", "Arduino documentation|https://docs.arduino.cc/"], 2.5],
            ["Analog, PWM & Servos", "Read the analog world and write 'fake' analog.",
              ["Read a potentiometer with analogRead and print it", "Fade an LED with analogWrite (PWM)", "Control a hobby servo with the Servo library", "Map a pot to servo angle"],
              ["Arduino built-in examples|https://docs.arduino.cc/built-in-examples/", "Paul McWhorter Arduino lessons"], 2.5],
            ["Interrupts vs Polling & Non-blocking Timing", "Write code that does many things at once.",
              ["Replace every delay() in a sketch with millis() timing", "Attach a hardware interrupt to a button and debounce it", "List when to prefer interrupts vs polling", "Blink two LEDs at different rates without delay()"],
              ["Arduino: Blink without delay|https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/", "Arduino attachInterrupt reference|https://docs.arduino.cc/language-reference/en/functions/external-interrupts/attachInterrupt/"], 3],
            ["Serial Debugging, I2C & SPI", "Talk to sensors and see what your code is doing.",
              ["Print readings with Serial and use the Serial Plotter", "Scan the I2C bus and find a device address", "Read one I2C sensor library example", "Compare I2C vs SPI in a short note"],
              ["Arduino Wire (I2C) reference|https://docs.arduino.cc/language-reference/en/functions/communication/wire/", "Adafruit I2C overview"], 2.5],
            ["BUILD: Reaction Timer Game", "Combine interrupts, non-blocking timing and serial output.",
              ["Light an LED after a random delay (non-blocking)", "Use an interrupt to capture the button press time", "Print the reaction time in ms over Serial", "Add a best-score tracker, upload a photo or video"],
              ["Arduino Project Hub|https://projecthub.arduino.cc/"], 3]
          ]
        },
        {
          title: "ESP32 & Connectivity",
          days: [
            ["ESP32 Setup & Architecture", "Know what makes ESP32 different from an Arduino UNO.",
              ["Add ESP32 board support and flash Blink", "Compare the Arduino layer vs ESP-IDF at a high level", "List the ESP32 peripherals: WiFi, BLE, ADC, touch, dual-core", "Pick your board (S3, classic or XIAO C3)"],
              ["Random Nerd Tutorials|https://randomnerdtutorials.com/", "Espressif ESP-IDF docs|https://docs.espressif.com/projects/esp-idf/"], 2.5],
            ["WiFi & HTTP Basics", "Put your microcontroller on the network.",
              ["Connect the ESP32 to WiFi and print its IP", "Make an HTTP GET request to a public API", "Serve a simple web page from the ESP32", "Handle reconnects after WiFi loss"],
              ["Random Nerd Tutorials|https://randomnerdtutorials.com/", "ESP32 WiFi guide"], 2.5],
            ["Async Web Server & Phone Control", "Control hardware from a browser.",
              ["Build an async web server with buttons that toggle an LED", "Add a slider that sets servo angle", "Read a sensor and show it live on the page", "Test from your phone on the same WiFi"],
              ["Random Nerd Tutorials|https://randomnerdtutorials.com/", "ESPAsyncWebServer"], 3],
            ["Bluetooth & Dual-core Tasks", "Use the other half of the chip.",
              ["Send data over BLE or Classic Bluetooth to a phone app", "Create two FreeRTOS tasks pinned to different cores", "Share data between tasks safely", "Note one gotcha you hit"],
              ["Random Nerd Tutorials|https://randomnerdtutorials.com/", "ESP32 FreeRTOS tasks"], 3],
            ["BUILD: ESP32 Web Remote", "Phone-controlled hardware, end to end.",
              ["Host a control page from the ESP32", "Control an LED or servo and read one sensor", "Record a short video of it working (upload below)", "Document wiring in your notes"],
              ["Random Nerd Tutorials|https://randomnerdtutorials.com/"], 3]
          ]
        },
        {
          title: "Motors & Closed-loop Control",
          days: [
            ["Motor Types & H-bridges", "Choose the right actuator for the job.",
              ["Compare brushed DC, hobby servo, bus servo and stepper", "Learn how an H-bridge reverses a motor", "Understand why L298N is obsolete and wasteful", "Pick your driver (DRV8833 or TB6612FNG)"],
              ["Pololu motor driver guides|https://www.pololu.com/category/11/motor-drivers", "Modern H-bridge explained"], 2],
            ["Driver Wiring & PWM Speed Control", "Spin a motor forward, backward and at set speeds.",
              ["Wire the driver, motor power and logic power with a common ground", "Drive a motor forward/reverse with PWM", "Record speed vs PWM duty cycle", "Learn what 'PWM != RPM' means in practice"],
              ["Pololu DRV8833 / TB6612 guides|https://www.pololu.com/", "Random Nerd Tutorials|https://randomnerdtutorials.com/"], 3],
            ["Encoders & RPM Measurement", "Measure what the wheel is actually doing.",
              ["Understand quadrature encoders (A/B channels)", "Count encoder ticks with interrupts", "Convert ticks to RPM and distance", "Plot RPM over time"],
              ["Pololu encoder guide|https://www.pololu.com/", "Quadrature encoder tutorial"], 3],
            ["Closed-loop Speed Control", "Hold a target RPM regardless of battery voltage.",
              ["Implement a P controller on motor speed", "Add an I term and watch steady-state error vanish", "Test at two different battery voltages", "Log setpoint vs measured RPM"],
              ["Brian Douglas: Understanding PID|https://www.youtube.com/@ControlTheory", "Arduino PID library"], 3],
            ["BUILD: Constant-RPM Motor + One Revolution", "Prove your control loop works.",
              ["Hold a target RPM under varying load or voltage", "Turn the wheel exactly one revolution with encoder feedback", "Plot your results and upload the graph", "Write what limited your accuracy"],
              ["Pololu gearmotor with encoder|https://www.pololu.com/"], 3]
          ]
        },
        {
          title: "IMUs, Filters & First Robots",
          days: [
            ["IMU Basics", "Read orientation data and understand its noise.",
              ["Wire an MPU-6050 and read raw accel/gyro", "Compute pitch from the accelerometer", "Integrate the gyro and observe drift", "Note the strengths and weaknesses of each"],
              ["Adafruit MPU-6050 guide|https://learn.adafruit.com/mpu6050-6-dof-accelerometer-and-gyro", "Adafruit BNO085 guide|https://learn.adafruit.com/adafruit-9-dof-orientation-imu-fusion-breakout-bno085"], 2.5],
            ["Complementary & Kalman Filters", "Fuse noisy sensors into a clean angle.",
              ["Implement the 4-line complementary filter", "Tune alpha and compare against raw readings", "Read the first chapters of Kalman and Bayesian Filters in Python", "Explain when you would upgrade to a Kalman filter"],
              ["Kalman & Bayesian Filters in Python|https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python", "MathWorks sensor fusion videos"], 3],
            ["Line Follower: Sensors & P-control", "Get a robot driving along a line.",
              ["Assemble a chassis with two motors and an IR sensor array", "Read and calibrate the sensors", "Implement a proportional steering controller", "Record a test run"],
              ["Line follower robot tutorial", "Pololu QTR sensors|https://www.pololu.com/category/123/pololu-qtr-reflectance-sensors"], 3.5],
            ["Line Follower: PD Tuning", "Tune the robot so it is both fast and stable.",
              ["Add a derivative term", "Tune Kp then Kd using a systematic method", "Record lap time for P vs PD", "Document your final constants"],
              ["Brian Douglas: Understanding PID|https://www.youtube.com/@ControlTheory", "PD line follower tuning"], 3.5],
            ["BUILD: Line Follower + IMU Pitch + Month 2 Retro", "Finish both Month 2 robots (balancer is a stretch goal).",
              ["Demonstrate P to PD improvement on the line follower", "Show stable IMU pitch output with your complementary filter", "Stretch: start the self-balancing robot build", "Write the Month 2 retrospective"],
              ["Self-balancing robot tutorial"], 4]
          ]
        }
      ]
    },
    /* ------------------------------------------------------------------ MONTH 3 */
    {
      title: "Mechanical Design, CAD & Manufacturing",
      short: "Mechanical",
      outcome: "Design, print and iterate your own parts, and assemble the SO-101 robot arm.",
      budget: "$200-800 printer (optional)  ·  service bureaus available",
      gear: [
        ["Bambu Lab A1 mini", "$219.99", "Great starter printer"],
        ["Creality Ender-3 V3 SE", "$199", "Budget option"],
        ["Bambu Lab A1", "$299.99", "256 mm bed"],
        ["Bambu Lab P1S", "$799", "Enclosed, ABS/ASA capable"],
        ["PLA / PETG / TPU filament", "$20-25 /kg", "TPU for gripper fingers"],
        ["SO-101 arm BOM (single)", "$121.94", "Pair for leader/follower: $229.88"],
        ["SO-101 pre-made kits", "$277-490", "Seeed, Robonine, WowRobo"]
      ],
      weeks: [
        {
          title: "CAD Fundamentals",
          days: [
            ["Pick Your CAD Tool & Tour It", "Commit to one CAD environment and learn the interface.",
              ["Compare Onshape, Fusion Personal, FreeCAD and SOLIDWORKS for Makers", "Make an account and complete the first tutorial", "Create your first sketch and extrude", "Decide and write down why you chose it"],
              ["Onshape Learning Center|https://learn.onshape.com/", "Learn Fusion in 30 Days", "MangoJelly FreeCAD tutorials"], 2.5],
            ["Parametric & Fully-constrained Sketches", "Build models that stay correct when dimensions change.",
              ["Draw sketches with dimensions and constraints until fully constrained", "Use named variables for key dimensions", "Change one variable and watch the model update", "Learn why under-constrained sketches break"],
              ["Onshape Learning Center|https://learn.onshape.com/"], 3],
            ["3D Features: Extrude, Revolve, Holes, Fillets", "Model realistic parts.",
              ["Model a bracket with extrude, hole wizard and fillets", "Use revolve to model a shaft or wheel", "Design around a real part's datasheet dimensions", "Learn STEP vs STL exports"],
              ["Onshape Learning Center|https://learn.onshape.com/"], 3],
            ["Assemblies & Mates", "Make parts move relative to each other.",
              ["Create an assembly with fixed, revolute and slider mates", "Check for interference", "Animate a simple mechanism", "Export an assembly as STEP"],
              ["Onshape Assembly tutorial|https://learn.onshape.com/"], 3],
            ["BUILD: Servo Bracket from a Datasheet", "Design for a real component.",
              ["Download a servo datasheet and measure the mounting holes", "Model a bracket with correct screw holes and clearances", "Export STL and slice it", "Upload your CAD screenshot"],
              ["Protolabs: Design for 3D printing|https://www.protolabs.com/resources/design-tips/"], 3.5]
          ]
        },
        {
          title: "3D Printing & Iteration",
          days: [
            ["Printers, Materials & Slicing", "Choose a material and understand slicer settings.",
              ["Compare PLA, PETG, ABS/ASA, nylon, carbon-fibre and TPU", "Install OrcaSlicer and slice your bracket", "Learn layer height, infill and walls trade-offs", "Decide: own a printer, or use a makerspace / service?"],
              ["OrcaSlicer wiki|https://github.com/SoftFever/OrcaSlicer/wiki", "Craftcloud|https://craftcloud3d.com/", "Fab Lab locations|https://www.fablabs.io/"], 2.5],
            ["Calibration", "Make prints dimensionally accurate.",
              ["Run first-layer and flow calibration", "Print a tolerance gauge", "Measure holes and shafts with calipers", "Record your printer's tolerance offsets"],
              ["OrcaSlicer calibration wiki|https://github.com/SoftFever/OrcaSlicer/wiki/Calibration", "Teaching Tech calibration|https://teachingtechyt.github.io/calibration.html"], 3],
            ["Design for Printing", "Avoid failed prints before they happen.",
              ["Learn print orientation and layer strength", "Reduce supports with chamfers and bridges", "Add tolerances for press fits and moving parts", "Re-orient your bracket for strength"],
              ["Protolabs: Design for 3D printing|https://www.protolabs.com/resources/design-tips/", "CNC Kitchen tests|https://www.youtube.com/@CNCKitchen"], 2.5],
            ["Snap-fits & Enclosures", "Make a clean housing for electronics.",
              ["Study snap-fit and cantilever hook geometry", "Model an ESP32 enclosure with a lid", "Add cable and USB cutouts", "Print a first draft and note the problems"],
              ["Snap-fit design guide"], 3],
            ["BUILD: Printed ESP32 Enclosure (Iterated)", "Do at least two real design iterations.",
              ["Print version 1 and list what's wrong", "Fix issues in CAD and print version 2", "Fit the ESP32 and test the lid", "Upload both versions' photos"],
              ["Fab Lab locations|https://www.fablabs.io/"], 4]
          ]
        },
        {
          title: "Actuators & Transmissions",
          days: [
            ["Gear Ratios: Speed vs Torque", "Know why robots use gearboxes.",
              ["Calculate the output speed and torque for a 4-gear train", "Compute torque needed to hold a 20 cm arm with a payload", "Compare efficiency of spur, planetary and worm gears", "Pick a ratio for a given motor"],
              ["Gear ratio explained", "Modern Robotics book|https://modernrobotics.northwestern.edu/nu-gm-book-resource/"], 2],
            ["Bearings, Belts & Direct Drive", "Choose the right transmission.",
              ["Learn bearing types and where to use them", "Compare belt, gear and direct-drive pros and cons", "Select a bearing for a shaft in your design", "Note ratings and preload"],
              ["Bearing selection guide", "Belt vs gear drive"], 2],
            ["Backlash & Measurement", "Quantify slop in a mechanism.",
              ["Define backlash and why it harms control", "Rig a way to measure it with an indicator or protractor", "Measure a printed gear pair", "Think of 2 ways to reduce backlash"],
              ["Backlash in robotics"], 2],
            ["Planetary & Cycloidal Reducers", "Design a compact high-ratio gearbox.",
              ["Study how a planetary gearset works", "Model a 3-planet reducer in CAD", "Compute its ratio from tooth counts", "Slice it with settings fit for gears"],
              ["3D printed planetary gearbox", "Cycloidal drive explained"], 3.5],
            ["BUILD: Printed Reducer + Backlash Test", "Build and quantify a real reducer.",
              ["Print and assemble the reducer", "Measure backlash in degrees", "Check that it spins freely", "Upload a video and your numbers"],
              ["OrcaSlicer wiki|https://github.com/SoftFever/OrcaSlicer/wiki"], 4]
          ]
        },
        {
          title: "SO-101 Robot Arm",
          days: [
            ["SO-101 Overview & Sourcing", "Plan the build before spending money.",
              ["Read the SO-101 repo and assembly guide", "Compare building from BOM ($122-230) vs a kit ($277-490)", "Compare cheaper options: EEZYbotARM MK2, Hiwonder xArm 1S", "Order parts and start printing"],
              ["SO-ARM100 / SO-101 repository|https://github.com/TheRobotStudio/SO-ARM100", "LeRobot SO-101 docs|https://huggingface.co/docs/lerobot/so101"], 2],
            ["Printing the Arm", "Produce parts that fit first time.",
              ["Print with PLA at 0.2 mm layers, 15% infill", "Clean up support marks and test-fit servos", "Label parts by joint", "Check print dimensions against the CAD"],
              ["SO-ARM100 repository|https://github.com/TheRobotStudio/SO-ARM100"], 3],
            ["Assembly: Servos, IDs & Wiring", "Put the arm together the right way.",
              ["Set unique servo IDs before mounting", "Assemble the follower arm joint by joint", "Route wires to avoid pinching", "Power and verify each servo moves"],
              ["LeRobot SO-101 docs|https://huggingface.co/docs/lerobot/so101"], 4],
            ["Calibration & Leader/Follower Teleop", "Mirror one arm with another.",
              ["Install LeRobot", "Calibrate follower and leader arms", "Run teleoperation", "Note how latency and calibration affect the feel"],
              ["LeRobot docs|https://huggingface.co/docs/lerobot", "LeRobot repository|https://github.com/huggingface/lerobot"], 3.5],
            ["BUILD: TPU Gripper Fingers + Month 3 Retro", "Customise the arm's end effector and close the month.",
              ["Design gripper fingers in CAD and print in TPU", "Test them on 3 different objects", "Log success per object", "Write the Month 3 retrospective"],
              ["SO-ARM100 repository|https://github.com/TheRobotStudio/SO-ARM100"], 4]
          ]
        }
      ]
    },
    /* ------------------------------------------------------------------ MONTH 4 */
    {
      title: "ROS 2, Simulation & Professional Architecture",
      short: "ROS 2",
      outcome: "A multi-node ROS 2 system, a simulated robot, ros2_control and autonomous Nav2 navigation.",
      budget: "$0 simulation-only  ·  $250-535 with hardware",
      gear: [
        ["Ubuntu 24.04 PC or VM", "$0", "Required for ROS 2 Jazzy (or use Docker/The Construct)"],
        ["Raspberry Pi 4/5", "$55-80", "Optional: onboard computer"],
        ["RPLIDAR C1", "$69", "Optional: real SLAM"],
        ["Hiwonder MentorPi M1", "$299.99", "Optional pre-built mobile base"],
        ["Waveshare UGV", "$534.99", "Optional pre-built rover"]
      ],
      weeks: [
        {
          title: "ROS 2 Core Concepts",
          days: [
            ["Install ROS 2 Jazzy & Workspaces", "Get a working environment (avoid ROS 1 material!).",
              ["Install ROS 2 Jazzy on Ubuntu 24.04 (or use Docker / The Construct)", "Create a colcon workspace and build an empty package", "Source overlays and understand underlay vs overlay", "Check tutorials mention colcon/ros2 (not catkin_make/roscore)"],
              ["ROS 2 Jazzy docs|https://docs.ros.org/en/jazzy/", "The Construct|https://app.theconstruct.ai/", "Articulated Robotics|https://www.youtube.com/@ArticulatedRobotics"], 3],
            ["Nodes & Topics", "Master publish/subscribe.",
              ["Write a Python publisher and subscriber node", "Inspect with ros2 topic list/echo/info and rqt_graph", "Learn the basics of QoS profiles", "Explain what to do when 'topic publishes but nothing receives'"],
              ["ROS 2 tutorials (Jazzy)|https://docs.ros.org/en/jazzy/Tutorials.html", "ROS 2 QoS concepts|https://docs.ros.org/en/jazzy/Concepts/Intermediate/About-Quality-of-Service-Settings.html"], 3],
            ["Services & Custom Interfaces", "Define your own message and service types.",
              ["Write a custom .msg and .srv", "Create a service server and client", "Build and test them with colcon", "Compare topic vs service vs action"],
              ["ROS 2 tutorials (Jazzy)|https://docs.ros.org/en/jazzy/Tutorials.html", "Edouard Renard ROS 2 for Beginners"], 3],
            ["Actions, Parameters & Launch Files", "Use the tools professional systems depend on.",
              ["Write an action server with feedback and cancellation", "Declare parameters and load them from YAML", "Write a Python launch file with arguments", "Use ros2 bag to record and replay topics"],
              ["ROS 2 tutorials (Jazzy)|https://docs.ros.org/en/jazzy/Tutorials.html", "MOGI-ROS course"], 3.5],
            ["BUILD: Multi-node System (No Robot)", "Architect a small system from scratch.",
              ["Create 4 nodes: publisher, processor, service-config, aggregator", "Use a custom .msg and .srv", "Launch everything with one launch file", "Record a bag and replay it. Push to GitHub"],
              ["ROS 2 tutorials (Jazzy)|https://docs.ros.org/en/jazzy/Tutorials.html"], 4]
          ]
        },
        {
          title: "URDF, TF & RViz",
          days: [
            ["TF2 & Coordinate Frames", "Understand how robots keep track of where everything is.",
              ["Watch Articulated Robotics' coordinate transforms series", "Publish a static transform", "View the tree with RViz and tf2 tools", "Explain parent/child frames"],
              ["Articulated Robotics|https://www.youtube.com/@ArticulatedRobotics", "ROS 2 TF2 tutorials|https://docs.ros.org/en/jazzy/Tutorials/Intermediate/Tf2/Tf2-Main.html"], 3],
            ["URDF Basics", "Describe a robot's links and joints.",
              ["Write a minimal URDF with 3 links and 2 joints", "Load it with robot_state_publisher", "Visualise in RViz and move joints with a GUI", "Know why joint_state_publisher != robot_state_publisher"],
              ["ROS 2 URDF tutorials|https://docs.ros.org/en/jazzy/Tutorials/Intermediate/URDF/URDF-Main.html"], 3],
            ["xacro Macros & Clean Descriptions", "Replace a 400-line XML with something maintainable.",
              ["Convert your URDF to xacro with properties and macros", "Add a camera and lidar frame", "Use arguments for configurable parts", "Run xacro to check the generated URDF"],
              ["ROS 2 URDF tutorials|https://docs.ros.org/en/jazzy/Tutorials/Intermediate/URDF/URDF-Main.html", "Articulated Robotics|https://www.youtube.com/@ArticulatedRobotics"], 3],
            ["Inertials, Visual vs Collision", "Make the model physically valid for simulation.",
              ["Compute mass and inertia tensors for each link", "Separate visual and collision geometry", "Simplify collision meshes", "Verify the lidar has a static transform"],
              ["URDF inertia calculator", "Articulated Robotics|https://www.youtube.com/@ArticulatedRobotics"], 2.5],
            ["BUILD: xacro Robot with Sensors", "Ship a simulation-ready robot description.",
              ["Create a base + wheels + lidar + camera xacro", "Add correct inertials", "Verify the TF tree is complete", "Screenshot RViz and upload it"],
              ["ROS 2 URDF tutorials|https://docs.ros.org/en/jazzy/Tutorials/Intermediate/URDF/URDF-Main.html"], 4]
          ]
        },
        {
          title: "Gazebo & ros2_control",
          days: [
            ["Gazebo Harmonic & SDF Worlds", "Set up a physics simulator that matches your ROS distro.",
              ["Match your pair: Jazzy + Harmonic", "Install Gazebo and open an example world", "Build a simple SDF world with walls", "Compare against MuJoCo, Isaac Sim and PyBullet"],
              ["Gazebo docs|https://gazebosim.org/docs", "ros_gz bridge|https://github.com/gazebosim/ros_gz"], 3],
            ["Spawn Your Robot & Sensor Plugins", "Bring your xacro robot to life.",
              ["Spawn the xacro robot in Gazebo", "Bridge topics between Gazebo and ROS 2", "Add lidar and camera plugins", "View sensor data in RViz"],
              ["Gazebo docs|https://gazebosim.org/docs", "Articulated Robotics|https://www.youtube.com/@ArticulatedRobotics"], 4],
            ["ros2_control Concepts", "Understand the standard hardware abstraction.",
              ["Learn hardware interfaces, controller manager, controllers", "Add <ros2_control> tags to your URDF", "Write the controller YAML config", "Read about the real-hardware transition path"],
              ["ros2_control docs|https://control.ros.org/", "Articulated Robotics|https://www.youtube.com/@ArticulatedRobotics"], 3],
            ["diff_drive_controller & Broadcasters", "Drive the simulated robot with standard controllers.",
              ["Configure diff_drive_controller", "Add joint_state_broadcaster", "Drive with teleop_twist_keyboard", "Check odometry output"],
              ["ros2_control docs|https://control.ros.org/"], 3],
            ["BUILD: Sim Robot + Distance Action Server", "Combine everything this week.",
              ["Robot runs in Gazebo with ros2_control", "Write a drive-distance action server with feedback and cancellation", "Test cancelling mid-way", "Record the screen and upload"],
              ["ROS 2 tutorials (Jazzy)|https://docs.ros.org/en/jazzy/Tutorials.html"], 4]
          ]
        },
        {
          title: "SLAM & Navigation",
          days: [
            ["Mapping with SLAM Toolbox", "Build a map from lidar.",
              ["Install and launch SLAM Toolbox", "Compare synchronous vs asynchronous modes", "Drive your sim robot and map a world", "Save the map"],
              ["SLAM Toolbox|https://github.com/SteveMacenski/slam_toolbox"], 3],
            ["Localization & Odometry Quality", "Understand why SLAM depends on good odometry.",
              ["Switch SLAM Toolbox to localization mode", "Add noise to odometry and watch the map degrade", "Check the lidar static transform", "Note RTAB-Map as an RGB-D alternative"],
              ["SLAM Toolbox|https://github.com/SteveMacenski/slam_toolbox", "RTAB-Map|https://github.com/introlab/rtabmap_ros"], 3],
            ["Nav2: Costmaps, Planners & Controllers", "Learn the Nav2 stack's moving parts.",
              ["Launch Nav2 with your robot and map", "Send a goal in RViz", "Read about the global planner, controller and recovery behaviours", "Identify the costmap layers"],
              ["Nav2 docs|https://docs.nav2.org/"], 3.5],
            ["Behavior Trees & Costmap Tuning", "Tune navigation until it is reliable.",
              ["Tune inflation radius and robot footprint", "Read a Nav2 behavior tree XML", "Test narrow doorways and obstacles", "Record before/after behaviour"],
              ["Nav2 docs|https://docs.nav2.org/"], 3.5],
            ["BUILD: Autonomous Navigation + Month 4 Retro", "Capture the full pipeline on video.",
              ["Map the world, switch to localization, then navigate autonomously", "Screen-record a successful run", "Upload your video and config", "Write the Month 4 retrospective"],
              ["Nav2 docs|https://docs.nav2.org/"], 4]
          ]
        }
      ]
    },
    /* ------------------------------------------------------------------ MONTH 5 */
    {
      title: "Control Theory, Kinematics & Perception",
      short: "Control & Perception",
      outcome: "Implement PID/LQR, solve forward and inverse kinematics, calibrate a camera, and plan manipulation with MoveIt 2.",
      budget: "$0-200 (hardware optional)",
      gear: [
        ["USB webcam", "$15-30", "For calibration & detection"],
        ["Printed chessboard target", "$0", "Print on A4 and mount flat"],
        ["SO-101 arm", "see Month 3", "For kinematics practice"]
      ],
      weeks: [
        {
          title: "Control Theory & PID",
          days: [
            ["Feedback & Understanding PID", "See what P, I and D each do physically.",
              ["Watch MATLAB Tech Talks: Understanding PID (parts 1-4)", "Explain P, I and D in plain words", "Identify failure modes for each term", "Start Brian Douglas's control lectures"],
              ["MATLAB Tech Talks: Understanding PID|https://www.youtube.com/@MATLAB", "Brian Douglas control lectures|https://www.youtube.com/@ControlTheory"], 3],
            ["Windup, Derivative Filtering & Feedforward", "Make PID safe for real hardware.",
              ["Implement integrator anti-windup", "Low-pass filter the derivative term", "Add feedforward and see the improvement", "Review steady-state error"],
              ["Fundamentals of Control Theory (free PDF)", "Feedback Systems by Astrom & Murray|https://www.cds.caltech.edu/~murray/amwiki/index.php/Main_Page"], 3],
            ["Implement PID in Python", "Build and test a controller in simulation.",
              ["Simulate a first/second-order plant in Python", "Code a reusable PID class", "Plot step responses", "Tune with a repeatable method"],
              ["Steve Brunton Control Bootcamp|https://www.youtube.com/@Eigensteve", "python-control library|https://python-control.readthedocs.io/"], 3],
            ["State Space & LQR", "Go beyond PID with principled gain selection.",
              ["Write a system in state-space form", "Learn controllability at a high level", "Use LQR to compute gains for a cart-pole", "Skim MPC and note its trade-offs"],
              ["Steve Brunton Control Bootcamp|https://www.youtube.com/@Eigensteve", "Underactuated Robotics (Tedrake)|https://underactuated.csail.mit.edu/"], 3.5],
            ["BUILD: PID Comparison + LQR Cart-pole", "Justify your controller choice with data.",
              ["Compare P-only, PD, PID and PID+feedforward step responses", "Implement LQR on a simulated cart-pole", "Compare vs hand-tuned PID", "Upload plots and write the conclusion"],
              ["python-control library|https://python-control.readthedocs.io/"], 4]
          ]
        },
        {
          title: "Kinematics & Dynamics",
          days: [
            ["Rigid-body Transforms", "Master homogeneous transformation matrices.",
              ["Read Modern Robotics chapter 3", "Compose rotations and translations by hand", "Compute a transform in Python with NumPy", "Check against ROS tf results"],
              ["Modern Robotics (Lynch & Park)|https://modernrobotics.northwestern.edu/", "QUT Robot Academy (Peter Corke)|https://robotacademy.net.au/"], 3],
            ["Forward Kinematics", "Compute the end-effector pose from joint angles.",
              ["Learn product-of-exponentials or DH conventions", "Compute FK for a 2-link planar arm by hand", "Compute FK for the SO-101", "Verify with Robotics Toolbox for Python"],
              ["Robotics Toolbox for Python|https://github.com/petercorke/robotics-toolbox-python", "Modern Robotics (Lynch & Park)|https://modernrobotics.northwestern.edu/"], 3.5],
            ["Inverse Kinematics", "Compute joint angles for a target pose.",
              ["Solve 2-link IK analytically", "Implement numerical IK (Newton-Raphson)", "Handle multiple solutions", "Detect unreachable targets"],
              ["Modern Robotics (Lynch & Park)|https://modernrobotics.northwestern.edu/", "Robotics Toolbox for Python|https://github.com/petercorke/robotics-toolbox-python"], 3.5],
            ["Jacobians, Singularities & Trajectories", "Understand how arms fail near edge cases.",
              ["Compute the Jacobian numerically", "Move near a singularity and observe behaviour", "Generate joint-space and Cartesian-space trajectories", "Identify workspace limits"],
              ["Modern Robotics (Lynch & Park)|https://modernrobotics.northwestern.edu/"], 3.5],
            ["BUILD: SO-101 FK/IK Notebook", "Document your kinematics practice.",
              ["Hand-calc FK then verify with Robotics Toolbox", "Run numerical IK and show a singularity case", "Publish a Jupyter notebook to GitHub", "Add plots to your README"],
              ["Robotics Toolbox for Python|https://github.com/petercorke/robotics-toolbox-python"], 4]
          ]
        },
        {
          title: "Computer Vision & Perception",
          days: [
            ["OpenCV Basics", "Get comfortable with images as arrays.",
              ["Work through the OpenCV Bootcamp", "Load, convert colour spaces, threshold and draw", "Capture from a webcam", "Build a quick colour-mask demo"],
              ["OpenCV Bootcamp", "OpenCV Python tutorials|https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html"], 3],
            ["Camera Model & Calibration", "Understand how a camera maps 3D to 2D.",
              ["Learn the pinhole model, intrinsics and distortion", "Print a chessboard", "Capture 20+ calibration images", "Run OpenCV calibration and report reprojection error"],
              ["OpenCV camera calibration|https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html", "Cyrill Stachniss lectures|https://www.youtube.com/@CyrillStachniss"], 3.5],
            ["Detection & Depth Sensing", "Find objects and understand depth options.",
              ["Detect a coloured object with contours", "Compare stereo, structured light and ToF depth", "Estimate distance with known object size", "Test under two lighting conditions"],
              ["OpenCV Python tutorials|https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html"], 3],
            ["Point Clouds with Open3D", "Process 3D data.",
              ["Install Open3D and load a point cloud", "Downsample and denoise", "Fit a plane (table) and remove it", "Cluster the remaining objects"],
              ["Open3D tutorials|https://www.open3d.org/docs/release/tutorial/"], 3],
            ["BUILD: Calibrate + Localise an Object in 3D", "Go from pixels to a position.",
              ["Calibrate the camera", "Detect an object and estimate its 3D position", "Change the lighting and fix your pipeline", "Upload results and a demo clip"],
              ["OpenCV camera calibration|https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html"], 4]
          ]
        },
        {
          title: "Manipulation & MoveIt 2",
          days: [
            ["MoveIt 2 Setup", "Get the standard manipulation framework running.",
              ["Install MoveIt 2 for Jazzy", "Run the Setup Assistant on an arm model", "Launch the demo in RViz", "Plan and execute a simple motion"],
              ["MoveIt 2 documentation|https://moveit.picknik.ai/", "Robotic Manipulation (Tedrake)|https://manipulation.mit.edu/"], 3.5],
            ["Planning Scene & Collisions", "Plan around obstacles safely.",
              ["Add collision objects to the planning scene", "Try different planners and compare", "Log planner failures and causes", "Understand IK and collision checking costs"],
              ["MoveIt 2 documentation|https://moveit.picknik.ai/"], 3],
            ["Trajectories & Constraints", "Shape motion beyond 'get there'.",
              ["Compare joint vs Cartesian paths", "Add orientation constraints", "Change velocity/acceleration scaling", "Observe what happens near joint limits"],
              ["MoveIt 2 documentation|https://moveit.picknik.ai/"], 3],
            ["Pick & Place with Task Constructor", "Decompose manipulation into stages.",
              ["Run the Task Constructor pick-and-place tutorial", "Understand the stage pipeline: approach, grasp, lift, place", "Look at grasp generation (e.g. Contact-GraspNet)", "Identify likely failure points"],
              ["MoveIt Task Constructor|https://moveit.picknik.ai/main/doc/examples/moveit_task_constructor/moveit_task_constructor_tutorial.html", "Contact-GraspNet|https://github.com/NVlabs/contact_graspnet"], 3.5],
            ["BUILD: MoveIt 2 Pick-and-Place + Month 5 Retro", "Close out the month with a working demo.",
              ["Simulate pick-and-place with obstacles", "Log planner behaviour under constraints", "Upload a screen recording", "Write the Month 5 retrospective"],
              ["MoveIt 2 documentation|https://moveit.picknik.ai/"], 4]
          ]
        }
      ]
    },
    /* ------------------------------------------------------------------ MONTH 6 */
    {
      title: "Robot Learning & Portfolio",
      short: "Learning & Portfolio",
      outcome: "A trained imitation-learning policy, an RL experiment, and a polished portfolio ready for interviews.",
      budget: "$0-500+ (hardware optional)",
      gear: [
        ["SO-101 leader + follower pair", "$229.88", "BOM cost for two arms"],
        ["Camera(s) for the arm", "$15-60", "Wrist/top camera for LeRobot"],
        ["GPU (RTX, 16GB+ VRAM for some VLAs)", "varies", "Or use Colab / cloud"]
      ],
      weeks: [
        {
          title: "Imitation Learning & LeRobot",
          days: [
            ["LeRobot Overview & Setup", "Learn the open-source stack behind modern robot learning.",
              ["Read the LeRobot docs and repo README", "Install LeRobot and PyTorch", "Start the Hugging Face Robotics Course", "Run a pretrained policy demo or example"],
              ["LeRobot docs|https://huggingface.co/docs/lerobot", "LeRobot repository|https://github.com/huggingface/lerobot", "Hugging Face Robotics Course|https://huggingface.co/learn"], 3],
            ["Teleoperation & Dataset Recording", "Collect clean demonstrations.",
              ["Choose a simple task (pick a block, place it in a bin)", "Set up cameras and lighting", "Record 10 test episodes", "Inspect the dataset and push it to the Hub"],
              ["LeRobot docs|https://huggingface.co/docs/lerobot"], 4],
            ["ACT: Action Chunking Transformer", "Understand the recommended first policy.",
              ["Read the ACT idea: predict chunks of future actions", "Review the training config", "Start a training run on your dataset", "Monitor loss curves"],
              ["LeRobot docs|https://huggingface.co/docs/lerobot", "ACT paper (ALOHA)"], 3.5],
            ["Deploy & Evaluate", "Run the policy on the real robot.",
              ["Load your trained policy on the follower arm", "Run 20 trials and count successes", "Record failure modes", "Save evaluation videos"],
              ["LeRobot docs|https://huggingface.co/docs/lerobot"], 4],
            ["BUILD: 50 Demos + First ACT Policy", "Deliver the baseline for improvement.",
              ["Record 50 demonstrations", "Train an ACT policy", "Measure the baseline success rate", "Upload dataset link, graphs and a video"],
              ["LeRobot repository|https://github.com/huggingface/lerobot"], 5]
          ]
        },
        {
          title: "Improving Policies, VLAs & RL",
          days: [
            ["Failure Analysis & Re-collection", "Learn from the failures, not just the successes.",
              ["Categorise failures from last week", "Record 50 more demos targeting those cases", "Retrain with the combined dataset", "Compare success rate before vs after"],
              ["LeRobot docs|https://huggingface.co/docs/lerobot"], 4],
            ["Diffusion Policy & Vision-Language-Action Models", "Know the frontier and its limits.",
              ["Skim Diffusion Policy and how it differs from ACT", "Compare open VLAs: pi0, OpenVLA, SmolVLA", "Note licensing: GR00T N1.x and RT-2", "Pick one VLA you might fine-tune"],
              ["Diffusion Policy paper", "OpenVLA|https://openvla.github.io/", "SmolVLA (Hugging Face)"], 3],
            ["Reinforcement Learning Basics", "Understand how RL differs from imitation.",
              ["Watch the first CS 285 lectures", "Learn policy gradients vs value methods at a high level", "Run an MJX / MuJoCo Playground tutorial", "Note why sim-to-real is hard"],
              ["CS 285 Deep RL (Berkeley)|https://rail.eecs.berkeley.edu/deeprlcourse/", "MuJoCo Playground|https://github.com/google-deepmind/mujoco_playground"], 3.5],
            ["Quadruped Locomotion & Reward Design", "See how reward shaping changes behaviour.",
              ["Train a quadruped in MuJoCo Playground", "Modify the reward and observe the new gait", "Plot training curves", "Write down what you learnt about reward hacking"],
              ["MuJoCo Playground|https://github.com/google-deepmind/mujoco_playground"], 4],
            ["BUILD: Documented Improvement + RL Write-up", "Turn experiments into evidence.",
              ["Write up the ACT before/after improvement", "Write up the RL experiment", "Add plots and videos to your README", "Publish to GitHub"],
              ["LeRobot repository|https://github.com/huggingface/lerobot"], 4]
          ]
        },
        {
          title: "Specialization & Portfolio Project",
          days: [
            ["Pick Your Path", "Choose a direction deliberately.",
              ["Read the three paths: Robot Learning, Autonomy/Mobile, Embedded/Mechatronics", "Look at 10 job postings per path", "Rate yourself on required skills", "Commit to one path in writing"],
              ["Source article: roadmap overview|https://technologiee.substack.com/p/how-to-become-a-robotics-engineer"], 2.5],
            ["Scope Your Flagship Project", "Plan something finishable in two weeks.",
              ["Define a measurable goal and success metric", "List hardware, software, risks", "Break it into daily tasks", "Create the repo and add the first commit"],
              ["Project planning for engineers"], 2.5],
            ["Build: Core Functionality", "Get the core working end to end.",
              ["Implement the main loop", "Test on real hardware where possible", "Commit early and often with meaningful messages", "Log metrics from day one"],
              ["GitHub Docs|https://docs.github.com/"], 4],
            ["Build: Metrics & Reliability", "Measure how well it works.",
              ["Run at least 20 trials", "Record success rate and failure modes", "Fix the top failure", "Re-run and compare"],
              ["GitHub Docs|https://docs.github.com/"], 4],
            ["BUILD: Finish & Document the Flagship", "Wrap the project to a portfolio standard.",
              ["Freeze features and clean the code", "Record a demo video", "Draw an architecture or wiring diagram", "Write the 'what broke and how I fixed it' section"],
              ["Make a README"], 4]
          ]
        },
        {
          title: "Portfolio, Interviews & Launch",
          days: [
            ["README Formula & Portfolio Audit", "Polish what reviewers actually look at.",
              ["For each project: video, diagram, measured numbers, 'what broke'", "Check there are no ROS 1 references left", "Remove or fix repos that would fail follow-up questions", "Pin your best 3-4 repos"],
              ["Source article: portfolio guidance|https://technologiee.substack.com/p/how-to-become-a-robotics-engineer"], 3],
            ["Interview Topics I: Kinematics, PID, Kalman, SLAM", "Prepare the core theory questions.",
              ["Explain IK and Jacobians out loud", "Explain PID failure modes and Kalman filtering", "Explain SLAM and Nav2 at a high level", "Solve 5 practice questions"],
              ["Glassdoor robotics engineer interview questions"], 3],
            ["Interview Topics II: Planning, C++ vs Python, Architecture", "Prepare systems and coding questions.",
              ["Explain RRT and when to use it", "Discuss C++ vs Python trade-offs in robotics", "Design a ROS 2 architecture on a whiteboard", "Debug a deliberately broken controller in simulation"],
              ["The Open Motion Planning Library|https://ompl.kavrakilab.org/", "ROS 2 tutorials (Jazzy)|https://docs.ros.org/en/jazzy/Tutorials.html"], 3.5],
            ["Mock Interview: 20-minute Repo Interrogation", "Survive three levels of 'why?' on your own code.",
              ["Ask a friend to question your best repo for 20 minutes", "Answer 3 levels deep on every line they pick", "Write down every question you could not answer", "Study those gaps"],
              ["Mock interview checklist"], 3],
            ["BUILD: Graduation - Publish & Apply", "Ship it.",
              ["Publish your portfolio site / GitHub profile", "Update your resume with metrics", "Apply to 5 roles or open-source contributions", "Write your 6-month retrospective and next goals"],
              ["Open-source robotics contributions: ROS 2, Nav2, MoveIt, LeRobot|https://github.com/huggingface/lerobot"], 4]
          ]
        }
      ]
    }
  ]
};
