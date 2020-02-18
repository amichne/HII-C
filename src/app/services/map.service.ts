import { Component, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
@Component({})
export class MapService {
    private path = 'localhost:5000/loupe_query/';

    public static STATIC_MAPPINGS = {
        // "90708001": ["8480-6", "55284-4"],
        // "44054006": ["8480-6", "55284-4", "8462-4"],
        "90708001": ["8480-6", "55284-4"],
        "44054006": ["8480-6", "2075-0", "8462-4"],
        "249288007": ["72166-2", "26511-6", "28542-9", "10839-9"],
        "185903001": ["718-7", "30385-9"],
        "54150009": ["2345-7", "26478-8", "17861-6", "26464-8", "13969-1"],
        "80394007": ["26464-8", "26515-7", "2951-2"],
        "32398004": ["789-8", "2823-3", "2345-7", "26450-7", "2157-6"],
        "89765005": ["26464-8", "26450-7", "785-6"],
        "267432004": ["2160-0", "786-4", "718-7", "30428-7", "10839-9"],
        "102588006": ["26478-8", "2345-7"],
        "266998003": ["785-6", "26450-7", "26511-6", "26515-7"],
        "38341003": ["718-7", "26478-8", "786-4", "2345-7"],
        "29857009": ["26464-8", "30428-7", "13969-1", "3094-0"],
        "442311008": ["32623-1", "777-3"]
    }

    constructor(private http: Http) { }

    load(hash: String): Observable<any> {
        console.log(this.path + hash);
        return this.http.get(this.path + hash).map(res => res.json());
    }
}
