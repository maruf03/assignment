var prime_num = 9007199254740881;
var prime_big_int = BigInt(prime_num);
var mod;
var hashTable = [];

var t = [];
var a;
var b;

async function getData() {
    var len;
    var table;
    await fetch('/js/dictionary.json')
        .then(response => response.text())
        .then(data => {
            table = JSON.parse(data);
        }).catch(err => alert(err))
    len = table.length;

    t = [];
    let map = new Map();
    for (i = 0; i < len; ++i) {
        if (map.get(table[i].en) == undefined) {
            t.push(table[i]);
            map.set(table[i].en, 1);
        }
    }
    len = t.length;

    a = BigInt(1 + Math.floor((Math.random() * prime_num - 1)));
    b = BigInt(Math.floor((Math.random() * prime_num)));
    mod = BigInt(len);
    var tempList = [];

    for (i = 0; i < len; ++i) {
        tempList[i] = [];
    }
    for (i = 0; i < len; ++i) {
        var k = 0n;
        var l = t[i].en.length;
        for (j = 0; j < l; ++j) {
            k = (k * 289n + BigInt(t[i].en.charCodeAt(j)) + 1n) % prime_big_int;
        }
        var slot = ((a * k + b) % prime_big_int) % mod;
        tempList[slot].push({ key: k, index: i });
    }
    for (i = 0; i < len; ++i) {
        var len2 = tempList[i].length;
        if (len2 == 0) continue;
        var m2 = BigInt(len2 * len2);
        while (true) {
            var a2 = BigInt(1 + Math.floor((Math.random() * prime_num - 1)));
            var b2 = BigInt(Math.floor((Math.random() * prime_num)));
            var cnt = 0;
            var t2 = new Array(Number(m2));
            for (j = 0; j < len2; ++j) {
                var slot = ((a2 * tempList[i][j].key + b2) % prime_big_int) % m2;
                if (t2[slot] == undefined) ++cnt;
                t2[slot] = tempList[i][j];
            }
            if (cnt == len2) {
                hashTable[i] = { a: a2, b: b2, m: m2, t: t2 };
                break;
            }
        }
    }
}

var check = getData();



document.getElementById("input").addEventListener("input", myfunction);
function myfunction() {
    var input = document.getElementById("input").value;
    if (input == "") {
        document.getElementById("output").innerHTML = '';
    }
    else {
        document.getElementById("output").innerHTML = '';


        if (check.isPending || check.isRejected) return;

        input = input.trim();
        input = input.toLowerCase();
        var k = 0n;
        for (i = 0; i < input.length; ++i) {
            k = (k * 289n + BigInt(input.charCodeAt(i)) + 1n) % prime_big_int;
        }
        var slot1 = ((a * k + b) % prime_big_int) % mod;
        if (hashTable[slot1] == undefined) {
            document.getElementById('output').innerHTML = "Not found";
            return;
        }
        var a2 = hashTable[slot1].a;
        var b2 = hashTable[slot1].b;
        var m2 = hashTable[slot1].m;
        var slot2 = ((a2 * k + b2) % prime_big_int) % m2;
        if (hashTable[slot1].t[slot2] == undefined) {
            document.getElementById('output').innerHTML = "<p>Not found</p>";
            return;
        }
        var index = hashTable[slot1].t[slot2].index;
        
        if (t[index].en != input) {
            document.getElementById('output').innerHTML = "<p>Not found</p>";
            return;
        }
        var p = document.createElement('p');
        p.textContent = t[index].bn;
        document.getElementById('output').appendChild(p);
    }
}