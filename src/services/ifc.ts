import { Direction } from "../intefaces";
import axios from "axios";
import {
  Context,
  getErrorMessage,
} from "../utils";
import { LogManager } from "../utils/logger";
const logger = LogManager.getInstance().get(Context.IFC);

export class IfcService {
    private static BaseUrl = "https://api-stage.bimplus.net/v2/";
    private static ProjectGuid = "b43bc8a5-6f1a-4511-aa26-e727430c17bf";

    public static async callAllplanApi(cuttingDirection: Direction, level: number): Promise<any| null> {

        const http = axios.create({
            baseURL: this.BaseUrl,
        });

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

        const res = await http.post('/ctf-nemetschek-allplan-gmbh-ft/services/CuttingCalculation', body);
        console.log(res);

    }
}
