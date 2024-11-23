import { Direction } from "../intefaces";
import axios from "axios";
import {
    AllplanToken,
    CuttingData,
} from "../intefaces";
import {
  Context,
  getErrorMessage,
} from "../utils";
import { LogManager } from "../utils/logger";
import * as fs from "fs";

const logger = LogManager.getInstance().get(Context.IFC);

export class IfcService {
    private static BaseUrl = "https://api-stage.bimplus.net/v2/";
    private static ProjectGuid = "b43bc8a5-6f1a-4511-aa26-e727430c17bf";


    public static async generateCuttingPlans(): Promise<CuttingData[]> {
        const data: CuttingData[] = [];
        //TODO
        const auth = await this.authorize();
        if (auth) {
//            const bottonLevel = 485800; // not yet
//            const bottonLevel = 485801; // there is data
//            const bottonLevel = 500699; // still have
//            const bottonLevel = 500700; // no data
            const bottonLevel = 485800; // still have
            const topLevel = 500700;
            const cutLevelDistances = 50;

            const cuttingDirection : Direction = {
                x: 0,
                y: 0,
                z: 1,
            };

            //const fs = require('fs').promises;
            for (let level = bottonLevel; level <= topLevel; level += cutLevelDistances) {
                const res = await this.callAllplanApi(cuttingDirection, level, auth.access_token);
                if (res) {
                    console.log(res);
                    data.push({level, glb: res});
                    //await fs.writeFile('d:\\Work\\sandbox\\hackathon-data\\floor-' + level + '.glb', res, "binary");
                } else {
                    logger.error(`Failed to cut on level: ${level}`);
                }
            }
        }
        return data;
    }

    private static async callAllplanApi(cuttingDirection: Direction, level: number, token: string): Promise<string | null> {
        const http = axios.create({baseURL: this.BaseUrl});

        const body = {
            cuttingCalculation: {
                projectId: this.ProjectGuid,
                cuttingPlanes: [
                    {
                        cuttingPoint: {
                            x: 0,
                            y: 0,
                            z: level,
                        },
                        cuttingDirection: {
                            x: cuttingDirection.x,
                            y: cuttingDirection.y,
                            z: cuttingDirection.z,
                        }
                    }
                ],
                settings: {
                    edges: false,
                    edgesThickness: 5,
                    faces: true,
                    levelOfDetail: 100,
                    responseGeometry: "glb"
                }
            },
            runAsync: false
        };


        var headers = {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`,
        };



        const res = await http.post('/ctf-nemetschek-allplan-gmbh-ft/services/CuttingCalculation', body, {headers, responseType: "stream"});
        if (res.status === 200) {
            const filePath = 'd:\\Work\\sandbox\\hackathon-data\\floor-' + level + '.glb';
            const file: NodeJS.WritableStream = fs.createWriteStream(filePath);
            res.data.pipe(fs.createWriteStream(filePath));
            return new Promise((resolve, reject) => {
                file.on("error", (err) => reject(err));

                const stream = res.data.pipe(file);

                stream.on("close", () => {
                    try { resolve(filePath); } catch (err) {
                        reject(err);
                    }
                });
            });
        }
        return null;

        // //const res = await http.post('/ctf-nemetschek-allplan-gmbh-ft/services/CuttingCalculation', body, {headers});
        // //if (res.status === 200) {
        //     //const fs = require('fs').promises;

        //     const file = fs.createWriteStream('d:\\Work\\sandbox\\hackathon-data\\floor-' + level + '.glb');
        //     const request = await http.post('/ctf-nemetschek-allplan-gmbh-ft/services/CuttingCalculation', body, {headers, responseType: "stream"}).then(res => {
        //         res.data.pipe(file);

        //         // after download completed close filestream
        //         file.on("finish", () => {
        //             file.close();
        //             console.log("Download Completed");
        //         });
        //         });

        //         fs.writeFile('d:\\Work\\sandbox\\hackathon-data\\floor-' + level + '.glb', res.data, ()=>{});
        //     });
        // //    return res.data as Buffer;
        // //}
        // return null;
    }

    private static async authorize(): Promise<AllplanToken | null> {
        const http = axios.create({baseURL: this.BaseUrl});
        const body = {
            user_id : "zubair.hossain@zenesis-planung.de",
            password : "zRWrfuTnizJH9qD" ,
            application_id : "9CFAE2CFCB8A458796B58E963E3D251D",
        };
        var headers = {
            'Content-Type' : 'application/json',
        };
        const res = await http.post('/authorize', body, {headers});
        if (res.status === 200) {
            return res.data as AllplanToken;
        }
        return null;
    }
}
