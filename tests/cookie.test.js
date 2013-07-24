test('Can parse cookies', function () {
    var fakeDocument = {
        cookie: '__qca=P0-1260642010-1372805398360; s_vi=[CS]v1|28E9AC7F051D2916-4000010C00043DF4[CE]; osCsid=DHGO2KVPCHHKTFA12TE8ERZ4F; imvu_avnm=andy; osCsidSandbox=ZTHGKPTFDHE428OK21VRHFCEA; s_cc=true; s_vnum=1374994800506%26vn%3D4; s_nr=1374615165309-Repeat; s_sq=%5B%5BB%5D%5D; session-id=HOZFF21VDT8GHEKTHEK4P2ACR; imvu_avnm_sandbox=admin; __utma=1.1522850827.1372720066.1374685709.1374696925.43; __utmb=1.42.10.1374696925; __utmc=1; __utmz=1.1372720066.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'
    };

    var actual = IMVU.getCookies(fakeDocument);

    var expected = {
        __qca: 'P0-1260642010-1372805398360',
        __utma: '1.1522850827.1372720066.1374685709.1374696925.43',
        __utmb: '1.42.10.1374696925',
        __utmc: '1',
        __utmz: '1.1372720066.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)',
        imvu_avnm: 'andy',
        imvu_avnm_sandbox: 'admin',
        osCsid: 'DHGO2KVPCHHKTFA12TE8ERZ4F',
        osCsidSandbox: 'ZTHGKPTFDHE428OK21VRHFCEA',
        s_cc: 'true',
        s_nr: '1374615165309-Repeat',
        s_sq: '%5B%5BB%5D%5D',
        s_vi: '[CS]v1|28E9AC7F051D2916-4000010C00043DF4[CE]',
        s_vnum: '1374994800506%26vn%3D4',
        'session-id': 'HOZFF21VDT8GHEKTHEK4P2ACR'
    };

    assert.deepEqual(expected, actual);
});
