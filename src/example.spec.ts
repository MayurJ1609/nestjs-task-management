//feature

class FriendsList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    console.log(`${name} is now a friend!`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);
    if (idx === -1) {
      throw new Error('Friend not found');
    }
    this.friends.splice(idx, 1);
  }
}

//tests
//"it" defines a test case
//expect is checking condition as in dotnet AreEqual() method
describe('FriendsList', () => {
  let friendsList;

  //This is jest method that runs before each test cases
  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('initializes friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('adds a friend to the list', () => {
    friendsList.addFriend('Mayur');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('announces friendship', () => {
    friendsList.announceFriendship = jest.fn(); //here jest.fn is mock function -- understand jest mock functions
    expect(friendsList.announceFriendship).not.toHaveBeenCalledTimes(1);
    friendsList.addFriend('Mayur');
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('Mayur');
  });

  describe('removeFriend', () => {
    it('removes a friend from the list', () => {
      friendsList.addFriend('Mayur');
      expect(friendsList.friends[0]).toEqual('Mayur');
      friendsList.removeFriend('Mayur');
      expect(friendsList.friends[0]).toBeUndefined;
    });
    it('throws an error as friend does not exist', () => {
      expect(() => friendsList.removeFriend('Mayur')).toThrow(
        new Error('Friend not found'),
      );
    });
  });
});
