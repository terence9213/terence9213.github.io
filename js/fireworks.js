window.onload = function () {
    console.log("Page load");
    Utils.Init();
}

console.log("PRELOAD");
var Utils = {
    TIMER: 0,
    //CANVAS OVERLAY & ANIMATIONS
    Canvas: {
        ElapsedTime: 0,
        LastFrameTimeStamp: null,
        FrameCounter: 0,
        FPS: 0,
        FPSDisplay: 0,
        DilationFactor: 1,
        TargetDilationFactor: 1,
        ShowStats: true,
        canvas: null,
        ctx: null,
        CtxTool: {
            Clear: function () {
                Utils.Canvas.ctx.clearRect(0, 0, Utils.Canvas.canvas.width, Utils.Canvas.canvas.height);
            },
            Line: function (ox, oy, tx, ty, w, clr) {
                Utils.Canvas.ctx.beginPath();
                Utils.Canvas.ctx.lineWidth = w;
                Utils.Canvas.ctx.strokeStyle = clr;
                Utils.Canvas.ctx.moveTo(ox, oy);
                Utils.Canvas.ctx.lineTo(tx, ty);
                Utils.Canvas.ctx.closePath();
                Utils.Canvas.ctx.stroke();
            },
            Circle: function (x, y, r, clr, alpha) {
                Utils.Canvas.ctx.globalAlpha = alpha ? alpha : 1;
                Utils.Canvas.ctx.beginPath();
                Utils.Canvas.ctx.fillStyle = clr;
                Utils.Canvas.ctx.arc(x, y, r, 0, Math.PI * 2, false);
                Utils.Canvas.ctx.fill();
                Utils.Canvas.ctx.closePath();
                Utils.Canvas.ctx.globalAlpha = 1;
            },
            Text: function (text, x, y, align, size, clr) {
                Utils.Canvas.ctx.font = size + "px Courier";
                Utils.Canvas.ctx.textAlign = align;
                Utils.Canvas.ctx.fillStyle = clr;
                Utils.Canvas.ctx.fillText(text, x, y);
            },
            BasicGradient: function (x, y, r1, r2, alpha) {
                Utils.Canvas.ctx.globalAlpha = alpha ? alpha : 1;
                //Utils.Canvas.ctx.globalCompositeOperation = "destination-out";
                var gradient = Utils.Canvas.ctx.createRadialGradient(x, y, r1, x, y, r2);
                gradient.addColorStop(0, "rgba(255, 150, 0, 0.7)");
                gradient.addColorStop(0.3, "rgba(255, 255, 100, 0.4)");
                gradient.addColorStop(0.8, "rgba(255, 255, 50, 0.15)");
                gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
                //gradient.addColorStop(0, "white");
                //gradient.addColorStop(0.5, "red");
                //gradient.addColorStop(1, "pink");
                Utils.Canvas.ctx.fillStyle = gradient;
                Utils.Canvas.ctx.fillRect(x - r2, y - r2, r2 * 2, r2 * 2);
                Utils.Canvas.ctx.globalAlpha = 1;
            },
            CreateGradient: function (ox, oy, tx, ty, clrStop) {
                var gradient = Utils.Canvas.ctx.createLinearGradient(ox, oy, tx, ty);
                gradient.addColorStop(0, clrStop);
                //gradient.addColorStop(0.8, "rgba(255, 255, 255, 0)");
                gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
                return gradient;
            }
        },
        SetDilationFactor: function (factor) {
            Utils.Canvas.TargetDilationFactor = factor;
        },
        //MAIN RENDER FUNCTION
        RenderFrame: function () {
            //Resolve Dilation Factor
            Utils.Canvas.DilationFactor = Utils.Canvas.TargetDilationFactor; 
            //FPS CALCULATION
            var DELTA = Utils.Canvas.LastFrameTimeStamp ? performance.now() - Utils.Canvas.LastFrameTimeStamp : 0;
            Utils.Canvas.ElapsedTime += DELTA * Utils.Canvas.DilationFactor;
            Utils.Canvas.FPS = Math.floor(1000 / DELTA);
            //if (Utils.Canvas.FPS <= 25) { console.log("FPS Drop : " + Utils.Canvas.FPS); }
            Utils.Canvas.LastFrameTimeStamp = performance.now();
            Utils.Canvas.FrameCounter++;
            if (Utils.Canvas.FrameCounter === 12) {
                Utils.Canvas.FrameCounter = 0;
                Utils.Canvas.FPSDisplay = Utils.Canvas.FPS;
            }
            //console.log(DELTA);
            Utils.Canvas.CtxTool.Clear();
            
            //Stats overlay
            Utils.Canvas.DrawStatsOverlay();

            // -*-*-*-*-*-*-*-*-*-*-*-* ANIMATIONS -*-*-*-*-*-*-*-*-*-*-*-* \\
            Utils.Canvas.Animation.FInterface.FrameTick(DELTA);

            Utils.Canvas.Animation.DrawAll(DELTA * Utils.Canvas.DilationFactor);


            window.requestAnimationFrame(Utils.Canvas.RenderFrame);
        },

        //Canvas stats overlay
        DrawStatsOverlay: function () {
            if (Utils.Canvas.ShowStats) {
                Utils.Canvas.CtxTool.Text("FPS : " + Utils.Canvas.FPSDisplay, 20, 20, "left", 15, "white");

                Utils.Canvas.CtxTool.Text("Time Dilation Factor : " + Utils.Canvas.DilationFactor, 20, 35, "left", 15, "white");
                Utils.Canvas.CtxTool.Text("Mouse Position : {X:" + Utils.UI.MousePos.x + " Y:" + Utils.UI.MousePos.y + "}", 20, 50, "left", 15, "white");
                //Utils.Canvas.CtxTool.Text("Performance.NOW() : " + performance.now() , 20, 65, "left", 15, "white");
                //Utils.Canvas.CtxTool.Text("ElpasedTime       : " + Utils.Canvas.ElapsedTime , 20, 80, "left", 15, "white");

                //FInterface Trigger Active Indicator
                Utils.Canvas.CtxTool.Circle(window.innerWidth - 15, 15, 10, Utils.Canvas.Animation.FInterface.Active ? "Green" : "Red", 1);
            }
        },

        //ALL ANIMATIONS HERE
        Animation: {
            MasterArray: [],
            //Draw ALL objects in MasterArray
            DrawAll: function (delta) {
                for (var i = 0; i < Utils.Canvas.Animation.MasterArray.length; i++) {
                    var animObj = Utils.Canvas.Animation.MasterArray[i];
                    animObj.Draw(delta, i);
                    if (!animObj.Active) {
                        //Animation complete [splice animObj from MasterArray & shift iteration index back]
                        Utils.Canvas.Animation.MasterArray.splice(i, 1);
                        if (i >= 0) { i-- };
                    };
                }
            },
            //OLD Fireworks 
            Fireworks: {
                Active: false,
                Pos: { x: 0, y: 0 },
                Particles: [],
                Start: function (x, y) {
                    if (!Utils.Canvas.Animation.Fireworks.Active) {
                        Utils.Canvas.Animation.Fireworks.Active = true;
                        Utils.Canvas.Animation.Fireworks.Pos = { x: x, y: y };

                        //Generate Particles [100]
                        for (var i = 0; i < 100; i++) {
                            //var acceleration = Utils.Draw.Rand.GenerateRandomFloat(0.01, 0.1);
                            var maxSpeed = Utils.Rand.Float(0.5, 10);
                            var size = Utils.Rand.Float(1, 5);
                            var vectorX = Utils.Rand.Float(-1, 1);
                            var vectorY = Utils.Rand.Float(-1, 1);
                            var rgb_r = Utils.Rand.Float(200, 255);
                            var rgb_g = Utils.Rand.Float(0, 255);
                            var rgb_b = Utils.Rand.Float(0, 255);
                            Utils.Canvas.Animation.Fireworks.Particles.push({
                                index: i,
                                timeStart: performance.now(),
                                pos: { x: x, y: y },
                                vector: { ox: x, oy: y, x: vectorX, y: vectorY },
                                speed: 0,
                                maxSpeed: maxSpeed,
                                acceleration: 0.2,
                                deceleration: 0.1,
                                halfLife: 500,
                                color: "rgb(" + rgb_r + "," + rgb_g + "," + 0 + ")",
                                alpha: 1,
                                size: size
                            });
                        }

                    }
                },
                End: function () {
                    Utils.Canvas.Animation.Fireworks.Particles = [];
                },
                DrawFireworks: function (delta) {
                    if (Utils.Canvas.Animation.Fireworks.Active) {
                        var fwObj = Utils.Canvas.Animation.Fireworks;
                        //SIZE RATE = 25px/second
                        //fwObj.Size += (50 / 1000) * delta;
                        //Utils.Canvas.CtxTool.Circle(fwObj.Pos.x, fwObj.Pos.y, fwObj.Size, "red");

                        for (var i = 0; i < fwObj.Particles.length; i++) {
                            var particle = fwObj.Particles[i];
                            //console.log(particle);

                            //Particle Decay
                            if (performance.now() >= particle.timeStart + particle.halfLife) {
                                if (particle.speed > 0) {
                                    particle.speed -= particle.deceleration;
                                    if (particle.speed < 0) {
                                        particle.speed = 0.05;
                                        particle.vector.x = 0;
                                        particle.vector.y = 1;
                                    }
                                }
                                if (performance.now() >= particle.timeStart + particle.halfLife + 1000) {
                                    if (particle.alpha > 0) {
                                        particle.alpha -= 0.01;
                                        if (particle.alpha < 0) { particle.alpha = 0; }
                                    }
                                }
                            }
                            //Particle Acceleration
                            else if (particle.speed < particle.maxSpeed) {
                                particle.speed += particle.acceleration;
                            }


                            particle.pos.x += delta * particle.speed * particle.vector.x;
                            particle.pos.y += delta * particle.speed * particle.vector.y

                            if (particle.alpha > 0) {
                                fwObj.Active = true;
                                Utils.Canvas.CtxTool.Circle(particle.pos.x, particle.pos.y, particle.size, particle.color, particle.alpha);
                            }
                            else {
                                fwObj.Active = false;
                            }
                        }

                        if (!fwObj.Active) {
                            fwObj.End();
                        }

                    }
                }
            },

            //FIREWORKS ANIMATION INTERFACE
            FInterface: {
                Active: true,
                Trigger: false,
                LaunchInterval: 100,
                PreviousLaunchTime: null,
                TriggerDown: function () {
                    Utils.Canvas.Animation.FInterface.Trigger = true;
                },
                TriggerUp: function () {
                    Utils.Canvas.Animation.FInterface.Trigger = false;
                },
                //Frame Dependant Tick
                FrameTick: function (delta) {
                    if (Utils.Canvas.Animation.FInterface.Active && Utils.Canvas.Animation.FInterface.Trigger) {
                        Utils.Canvas.Animation.FInterface.TryLaunch(delta);
                    }
                },
                //Launch if Interval has passed
                TryLaunch: function () {
                    if (Utils.Canvas.Animation.FInterface.PreviousLaunchTime === null || performance.now() >= Utils.Canvas.Animation.FInterface.PreviousLaunchTime + Utils.Canvas.Animation.FInterface.LaunchInterval / Utils.Canvas.DilationFactor) {
                        var ff = new Utils.Canvas.Animation.FFireworks();
                        ff.Start(Utils.UI.MousePos.x, Utils.UI.MousePos.y, 0, false);
                        Utils.Canvas.Animation.FInterface.PreviousLaunchTime = performance.now();
                    }
                },
                Launch: function (animationSeq) {
                    var ff = new Utils.Canvas.Animation.FFireworks(animationSeq.ox, animationSeq.oy);
                    ff.Start(animationSeq.x, animationSeq.y, animationSeq.delay, animationSeq.noLaunch);
                },
                MultiLaunch: function (tier) {
                    var animationSeqArray = Utils.Sequence.Animations[tier].DrawEnd;
                    for (var i = 0; i < animationSeqArray.length; i++) {
                        Utils.Canvas.Animation.FInterface.Launch(animationSeqArray[i]);
                    }
                }
            },

            //Animation Template Objects
            FFireworks: function (ox, oy) {
                this.ox = (ox === null || ox === undefined) ? Utils.Canvas.canvas.width / 2 : ox;
                this.oy = (oy === null || oy === undefined) ? Utils.Canvas.canvas.height : oy;
                this.Active = false;
                //this.LaunchVector = { x: 0, y: 0 };
                this.Delay = 0;
                this.StartTime = 0;
                this.Pos = { x: 0, y: 0 };
                this.Particles = [];
                this.LaunchParticle = null;
				this.NoLaunch = false;
				this.SoundOffLaunch = false;
				this.SoundOffBang = false;
                this.Start = function (x, y, delay, noLaunch) {
                    if (!this.Active) {
                        this.Active = true;
                        this.Pos = { x: x, y: y };
                        this.StartTime = Utils.Canvas.ElapsedTime;
                        //this.ElapsedTime = 0;
                        this.Delay = delay;

                        //Calculate Launch Vector
                        var dx = x - this.ox;
                        var dy = y - this.oy;
                        var dist = Math.sqrt(dx * dx + dy * dy);
                        var launchVector = { x: dx / dist, y: dy / dist };

                        //console.log(launchVector);
                        //Initialise Launch Projectile
                        this.LaunchParticle = {
                            //Active: true,
                            State: noLaunch ? 0 : 1, // [0 : done] [1 : Launch] [2 : Explode] 
                            Pos: { x: this.ox, y: this.oy },
                            Vector: launchVector,
                            Speed: 1100, // (px/s)
                            TargetDist: dist,
                            TravelledDist: 0,
                            Explosion: {
                                State: noLaunch ? 1 : 0, // [0 : done] [1 : Expand] [2 : Contract] 
                                Radius: { r1: 1, r2: 5 },
                                Acceleration: { r1: 0.07, r2: 0.28 },
                                Deceleration: { r1: 0.6, r2: 0.9 },
                                Speed: { r1: 0, r2: 0, r1AccPhase: true, r2AccPhase: true, r1Max: 15, r2Max: 20 },
                                HalfLife: 20,
                                AlphaDecayRate: 0.1,
                                Alpha: 1
                            }
                        };

                        if (noLaunch) {
							this.NoLaunch = true;
                            this.GenerateParticles(delay);
                        }

                        Utils.Canvas.Animation.MasterArray.push(this);
                        
                    }
                };
                this.GenerateParticles = function (noLaunchDelay) {
                    //Generate Particles
                    var particleCount = Utils.Rand.Int(30, 50);
                    for (var i = 0; i < particleCount; i++) {
                        var maxSpeed = Utils.Rand.Float(0.5, 2);
                        var halfLife = Utils.Rand.Int(350, 550); // default 500
                        var decay = Utils.Rand.Int(200, 400); // default 1000
                        var size = Utils.Rand.Float(0.1, 2.8);
                        var angle = Math.random() * Math.PI * 2;
                        //var vectorX = Utils.Rand.Float(-1, 1);
                        //var vectorY = Utils.Rand.Float(-1, 1);
                        var vectorX = Math.cos(angle) * Utils.Rand.Float(-1, 1);
                        var vectorY = Math.cos(angle) * Utils.Rand.Float(-1, 1);
                        var rgb_r = Utils.Rand.Float(200, 255);
                        var rgb_g = Utils.Rand.Float(0, 255);
                        var rgb_b = Utils.Rand.Float(0, 255);
                        this.Particles.push({
                            index: i,
                            timeStart: (noLaunchDelay === undefined || noLaunchDelay === null) ? performance.now() : performance.now() + noLaunchDelay,
                            pos: { x: this.Pos.x, y: this.Pos.y },
                            vector: { x: vectorX, y: vectorY },
                            speed: 2,
                            maxSpeed: maxSpeed,
                            acceleration: 0.1,
                            deceleration: 0.2,
                            gravity: 0.05,
                            halfLife: halfLife,
                            decay: decay,
                            color: "rgb(" + rgb_r + "," + rgb_g + "," + 0 + ")",
                            alphaDecayRate: 0.015,// * Utils.Canvas.DilationFactor,
                            alpha: 1,
                            size: size,
                            dead: false
                        });
                    }
                    //console.log(this.Particles);
                };
                this.End = function (i) {
                    this.Particles = [];
                    Utils.Canvas.Animation.MasterArray.splice(i, 1);
                };
                this.Draw = function (delta, index) {
                    //this.ElapsedTime += delta * Utils.Canvas.DilationFactor;
                    //if (performance.now() >= this.StartTime + this.Delay) {
                    if (Utils.Canvas.ElapsedTime >= this.StartTime + this.Delay) {
                        this.launched = true;
						if(!this.SoundOffLaunch && !this.NoLaunch){
							//PLAY WOOSH SOUND CLIP
							Utils.Synth.playClip(Utils.Synth.clip.WOOSH);
							this.SoundOffLaunch = true;
						}
						
                        //Animate Launch Particle
                        if (this.LaunchParticle.State === 1) {
                            if (this.LaunchParticle.TravelledDist < this.LaunchParticle.TargetDist) {
                                var dist = this.LaunchParticle.Speed / 1000 * delta;
                                this.LaunchParticle.Pos.x += this.LaunchParticle.Vector.x * dist;
                                this.LaunchParticle.Pos.y += this.LaunchParticle.Vector.y * dist;
                                var dx = this.LaunchParticle.Pos.x - this.ox;
                                var dy = this.LaunchParticle.Pos.y - this.oy;
                                this.LaunchParticle.TravelledDist = Math.sqrt(dx * dx + dy * dy);
                                //DRAW
                                //Main launch particle
                                Utils.Canvas.CtxTool.Line(this.LaunchParticle.Pos.x, this.LaunchParticle.Pos.y,
                                    this.LaunchParticle.Pos.x - this.LaunchParticle.Vector.x * 25,
                                    this.LaunchParticle.Pos.y - this.LaunchParticle.Vector.y * 25, 2, "yellow");
                                //Launch Particle Head
                                Utils.Canvas.CtxTool.Circle(this.LaunchParticle.Pos.x, this.LaunchParticle.Pos.y, 1.5, "red", 1);
                                //Gradient for launch particle trail
                                var grad = Utils.Canvas.CtxTool.CreateGradient(
                                    this.LaunchParticle.Pos.x - this.LaunchParticle.Vector.x * 25, this.LaunchParticle.Pos.y - this.LaunchParticle.Vector.y * 25,
                                    this.LaunchParticle.Pos.x - this.LaunchParticle.Vector.x * 200, this.LaunchParticle.Pos.y - this.LaunchParticle.Vector.y * 200,
                                    "rgba(250, 200, 125, 0.7)");
                                //Launch Particle Trail
                                Utils.Canvas.CtxTool.Line(
                                    this.LaunchParticle.Pos.x - this.LaunchParticle.Vector.x * 25, this.LaunchParticle.Pos.y - this.LaunchParticle.Vector.y * 25,
                                    this.LaunchParticle.Pos.x - this.LaunchParticle.Vector.x * 200, this.LaunchParticle.Pos.y - this.LaunchParticle.Vector.y * 200,
                                    3, grad);

                                
                            }
                            else {
                                //Initialise Explosion
                                this.LaunchParticle.Explosion.State = 1;
                                this.LaunchParticle.State = 2;
                                this.GenerateParticles();
                            }
                        }
                        //Animate Firework Particles and Explosion
                        else {
							//SFX
							if(!this.SoundOffBang){
								//PLAY BANG SOUND CLIP
								Utils.Synth.playClip(Utils.Synth.clip.BANG);
								this.SoundOffBang = true;
							}
							
							
                            //Explosion
                            if (this.LaunchParticle.Explosion.State !== 0) {
                                //R1 SPD Calculation
                                var r1Spd = null;
                                if (this.LaunchParticle.Explosion.Speed.r1AccPhase) {
                                    //Accelerate r1 spd
                                    r1Spd = this.LaunchParticle.Explosion.Speed.r1 += this.LaunchParticle.Explosion.Acceleration.r1 * Utils.Canvas.DilationFactor;
                                    if (r1Spd >= this.LaunchParticle.Explosion.Speed.r1Max) {
                                        this.LaunchParticle.Explosion.Speed.r1AccPhase = false;
                                    }
                                }
                                else {
                                    r1Spd = this.LaunchParticle.Explosion.Speed.r1
                                    //Decelerate r1 spd
                                    if (r1Spd >= 0) {
                                        r1Spd = this.LaunchParticle.Explosion.Speed.r1 -= this.LaunchParticle.Explosion.Deceleration.r1 * Utils.Canvas.DilationFactor;
                                        if (r1Spd < 0) { r1Spd = this.LaunchParticle.Explosion.Speed.r1 = 0; }
                                    }
                                }

                                //R2 SPD Calculation
                                var r2Spd = null;
                                if (this.LaunchParticle.Explosion.Speed.r2AccPhase) {
                                    //Accelerate r1 spd
                                    r2Spd = this.LaunchParticle.Explosion.Speed.r2 += this.LaunchParticle.Explosion.Acceleration.r2 * Utils.Canvas.DilationFactor;
                                    if (r2Spd >= this.LaunchParticle.Explosion.Speed.r2Max) {
                                        this.LaunchParticle.Explosion.Speed.r2AccPhase = false;
                                    }
                                }
                                else {
                                    r2Spd = this.LaunchParticle.Explosion.Speed.r2;
                                    //Decelerate r1 spd
                                    if (r2Spd >= 0) {
                                        r2Spd = this.LaunchParticle.Explosion.Speed.r2 -= this.LaunchParticle.Explosion.Deceleration.r2 * Utils.Canvas.DilationFactor;
                                        if (r2Spd < 0) { r2Spd = this.LaunchParticle.Explosion.Speed.r2 = 0; }
                                    }
                                }

                                //CALCULATE R1 & R2
                                var r1 = this.LaunchParticle.Explosion.Radius.r1 += r1Spd * delta;
                                var r2 = this.LaunchParticle.Explosion.Radius.r2 += r2Spd * delta;
                                
                                //Calculate ALPHA
                                var alpha = this.LaunchParticle.Explosion.Alpha
                                if (this.LaunchParticle.Explosion.State === 2 && alpha > 0) {
                                    //DECAY
                                    alpha = this.LaunchParticle.Explosion.Alpha -= this.LaunchParticle.Explosion.AlphaDecayRate * Utils.Canvas.DilationFactor;
                                }
                                else if (performance.now() >= this.StartTime + (this.LaunchParticle.Explosion.HalfLife / Utils.Canvas.DilationFactor)) {
                                    this.LaunchParticle.Explosion.State = 2;
                                }

                                if (alpha > 0) {
                                    Utils.Canvas.CtxTool.BasicGradient(this.Pos.x, this.Pos.y, r1, r2, alpha);
                                }

                            }
                            
                            this.Active = false;
                            //Particles
                            for (var i = 0; i < this.Particles.length; i++) {
                                var particle = this.Particles[i];
                                //console.log(particle);

                                //Particle HalfLife / Decay
                                if (performance.now() >= particle.timeStart + (particle.halfLife / Utils.Canvas.DilationFactor)) {
                                    //Particle Death
                                    if (!particle.dead && particle.speed > 0) {
                                        particle.speed -= particle.deceleration * Utils.Canvas.DilationFactor;
                                        if (particle.speed <= 0) {
                                            particle.dead = true;
                                            particle.speed = particle.gravity;
                                            particle.vector.x = 0;
                                            particle.vector.y = 1;
                                        }
                                    }
                                    //Decay
                                    if (performance.now() >= particle.timeStart + (particle.halfLife / Utils.Canvas.DilationFactor) + (particle.decay / Utils.Canvas.DilationFactor)) {
                                        if (particle.alpha > 0) {
                                            particle.alpha -= particle.alphaDecayRate * Utils.Canvas.DilationFactor;
                                            if (particle.alpha < 0) { particle.alpha = 0; }
                                        }
                                    }
                                }
                                //Particle Acceleration
                                else if (performance.now() >= particle.timeStart && particle.speed < particle.maxSpeed) {
                                    particle.speed += particle.acceleration * Utils.Canvas.DilationFactor;
                                }

                                particle.pos.x += delta * particle.speed * particle.vector.x;
                                particle.pos.y += delta * particle.speed * particle.vector.y

                                if (particle.alpha > 0) {
                                    this.Active = true;
                                    //console.log(particle.pos.x + " " + particle.pos.y + " " + particle.size + " " + particle.alpha);
                                    Utils.Canvas.CtxTool.Circle(particle.pos.x, particle.pos.y, particle.size, particle.color, particle.alpha);
                                }

                                if (!this.Active) {
                                    //this.End(i);
                                }
                            }
                        }
                    }

                };
            }
        }

    },

    Synth: null,

    //INITIALISE FUNCTION
    Init: function () {
        //INIT Audio Synth
        Utils.Synth = new AudioSynth();
        Utils.Synth.init();


        //Get Element refferences
        Utils.Elements.background = document.getElementById("bg-effects");

        //Set EventListeners
        document.addEventListener("keydown", Utils.UI.KeyDown);
        document.addEventListener("mousedown", Utils.UI.MouseDown);
        document.addEventListener("mouseup", Utils.UI.MouseUp);
        document.addEventListener("mousemove", Utils.UI.MouseMove);

        //Generate BG Stars
        Utils.Effects.GenerateBGStars();
        Utils.Effects.InitShootingStars();

        //Init Sequencer
        //Utils.Sequence.Init();
        //Init Draw function
        //Utils.Draw.Init();

        //Init Canvas
        Utils.Canvas.canvas = document.getElementById("canvas");
        Utils.Canvas.ctx = Utils.Canvas.canvas.getContext("2d");
        //Utils.Canvas.canvas.width = 1366;
        //Utils.Canvas.canvas.width = 1024;
        Utils.Canvas.canvas.width = window.innerWidth;
        //Utils.Canvas.canvas.height = 657;
        //Utils.Canvas.canvas.height = 697;
        Utils.Canvas.canvas.height = window.innerHeight;
        Utils.Canvas.RenderFrame();
    },

    //DOCUMENT ELEMENT REFFERENCES
    Elements: {
        background: null
    },

    //UI EVENT LISTENERS
    UI: {
        MousePos: { x: null, y: null },
        BtnClick: function (e) {
            e.preventDefault();
            Utils.Draw.StartDraw();
        },
        KeyDown: function (e) {
            //e.preventDefault();
            console.log(e.keyCode);
            if (e.ctrlKey) {
                switch (e.keyCode) {
                    case 83: //S Key
                        break;
                    case 88: // X Key
                        break;
                    case 76: // L Key 
                        break;
                }
            }
            else {
                switch (e.keyCode) {
                    case 32: //SPACEBAR
                        break;
                    case 13: // ENTER
                        break;
                    case 39: //RIGHT ARROW
                        if (Utils.Canvas.DilationFactor < 1) {
                            //Utils.Canvas.DilationFactor += 0.01;
                            //Utils.Canvas.DilationFactor = Math.round(Utils.Canvas.DilationFactor * 100) / 100;
                            //document.getElementById("time-slider").value = Utils.Canvas.DilationFactor;
                        }
                        break;
                    case 37: //LEFT ARROW
                        if (Utils.Canvas.DilationFactor > 0) {
                            //Utils.Canvas.DilationFactor -= 0.01;
                            //Utils.Canvas.DilationFactor = Math.round(Utils.Canvas.DilationFactor * 100) / 100;
                            //document.getElementById("time-slider").value = Utils.Canvas.DilationFactor;
                        }
                        break;
                    case 116: //F5 (REFRESH)
                        //e.preventDefault();
                        break;
                    case 70: // F Key (FInterface Trigger Active)
                        Utils.Canvas.Animation.FInterface.Active = !Utils.Canvas.Animation.FInterface.Active;
                        break;
                    case 68: // D Key
                    case 79: // O Key (Toggle Canvas Stats Overlay)
                        Utils.Canvas.ShowStats = !Utils.Canvas.ShowStats;
                        break;
					case 83: //S Key (Synth test)
						Utils.Synth.tap();
						break;
                }
            }
            
        },
        MouseDown: function (e) {
            //console.log(e.x + " x " + e.y);
            //var fireworksAnimation = new Utils.Canvas.Animation.FFireworks();
            //fireworksAnimation.Start(e.x, e.y, 0, false);
            if(e.target.id != "time-slider"){
                e.preventDefault();
                Utils.Canvas.Animation.FInterface.TriggerDown();
            }
        },
        MouseUp: function (e) {
            Utils.Canvas.Animation.FInterface.TriggerUp();
        },
        MouseMove: function (e) {
            Utils.UI.MousePos.x = e.clientX;
            Utils.UI.MousePos.y = e.clientY;
        }
    },


    //RANDOM NUMBER GENERATOR
    Rand: {
        Int: function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        Float: function (min, max) {
            return Math.random() * (max - min) + min;
        }
    },

    //BG EFFECTS
    Effects: {
        GenerateBGStars: function () {
            var width = window.innerWidth;
            var height = window.innerHeight;

            for (var i = 0; i < 80; i++) {
                var star = document.createElement("div");
                star.classList.add("star");
                star.style.top = Utils.Rand.Int(0, height) + "px";
                star.style.left = Utils.Rand.Int(0, width) + "px";
                var animationDuration = Utils.Rand.Int(2000, 10000);
                star.style.animation = "blink ease-in-out " + animationDuration + "ms infinite";
                Utils.Elements.background.appendChild(star);
            }
        },
        InitShootingStars: function () {
            //8 SHOOTING STARS
            for (var i = 0; i < 8; i++) {
                var startPos = { x: Utils.Rand.Int(100, window.innerWidth + 100), y: window.innerHeight };
                var endPos = { x: startPos.x - window.innerHeight - 100, y: startPos.y - window.innerHeight - 100 };
                var shootAnimation = [
                    { offset: 0.0, left: startPos.x + "px", bottom: startPos.y + "px" },
                    { offset: 0.1, left: endPos.x + "px", bottom: endPos.y + "px" },
                    { offset: 1.0, left: endPos.x + "px", bottom: endPos.y + "px" }
                ];
                var shootTiming = {
                    duration: Utils.Rand.Int(10000, 20000),
                    iterations: Infinity,
                    delay: Utils.Rand.Int(10000, 20000)
                    //delay: 0
                };

                var shootingStar = document.createElement("div");
                shootingStar.classList.add("shooting-star");
                shootingStar.animate(shootAnimation, shootTiming);
                Utils.Elements.background.appendChild(shootingStar);
            }
        },

    }
}
