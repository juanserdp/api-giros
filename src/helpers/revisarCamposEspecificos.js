export function revisarCamposEspecificos(error, res, done, campos, assert) {
    if (error) return done(error);
    assert.graphQL(res.body);

    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('asesor');

    const { asesor } = res.body.data;
    expect(asesor).to.be.a("object");

    for (const prop in campos) {
        expect(asesor).to.have.property(prop);
        if (prop == 'clave') {
            expect(asesor[prop]).to.be.a("string");
            expect(asesor[prop]).to.have.lengthOf(60);
            continue;
        };
        if (prop == 'usuarios') {
            expect(asesor[prop]).to.be.a("array");
            expect(asesor[prop]).to.have.lengthOf(0);
            continue;
        };
        expect(asesor[prop]).to.equal(campos[prop]);
    };
    done();
};