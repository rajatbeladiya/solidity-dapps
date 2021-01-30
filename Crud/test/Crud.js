const Crud = artifacts.require('Crud');

contract('Crud', () => {
  let crud;
  before(async () => {
    crud = await Crud.deployed();
  });

  it('Should create user', async () => {
    await crud.create('Rajat');
    const user = await crud.read(1);
    assert(user[0].toNumber() === 1);
    assert(user[1] === 'Rajat');
  });

  it('Should update a user', async () => {
    await crud.update(1, 'Prince');
    const user = await crud.read(1);
    assert(user[1] === 'Prince');
  });

  it('Should NOT update a non-existance user', async () => {
    try {
       await crud.update(2, 'Rajat');
    } catch (e) {
      assert(e.message.includes('User does not exist'));
      return;
    }
    return(false);
  });

  it('Should destroy a user', async () => {
    await crud.destroy(1);
    try {
      await crud.read(1);
    } catch (e) {
      assert(e.message.includes('User does not exist'));
      return;
    }
    assert(false);
  });

  it('Should NOT destroy a non-existing user', async () => {
    try {
      await crud.destroy(10);
    } catch(e) {
      assert(e.message.includes('User does not exist'));
      return;
    }
    assert(false);
  });

});