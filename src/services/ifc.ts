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
const logger = LogManager.getInstance().get(Context.IFC);

export class IfcService {
    private static BaseUrl = "https://api-stage.bimplus.net/v2/";
    private static ProjectGuid = "b43bc8a5-6f1a-4511-aa26-e727430c17bf";


    public static async generateCuttingPlans(): Promise<CuttingData[]> {
        const data: CuttingData[] = [];
        //TODO
        const auth = await this.authorize();
        if (auth) {
            const bottonLevel = 0;
            const topLevel = 1.0;
            const cutLevelDistances = 0.05;

            const cuttingDirection : Direction = {
                x: 0,
                y: 0,
                z: 1,
            };

            for (let i = 0; i < 10; i += 1) {
                const level = bottonLevel + i * cutLevelDistances;
                const res = await this.callAllplanApi(cuttingDirection, level, auth.access_token);
                if (res) {
                    data.push({level, glb: res});
                } else {
                    logger.error(`Failed to cut on level: ${level}`);
                }
            }
        }
        return data;
    }

    private static async callAllplanApi(cuttingDirection: Direction, level: number, token: string): Promise<Buffer | null> {
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
        const res = await http.post('/ctf-nemetschek-allplan-gmbh-ft/services/CuttingCalculation', body, {headers});
        if (res.status === 200) {
            return res.data as Buffer;
        }
        return null;
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
