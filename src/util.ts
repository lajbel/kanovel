// conver arrays to vec2
export function array2Vec2(arr: number[]) {
    return vec2(arr[0], arr[1]);
}

// generated by copilot lol
export function insertInArray(arr: any[], index: number, value: any) {
    arr.splice(index, 0, value);
}

// download
export function download(filename: string, url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
}
