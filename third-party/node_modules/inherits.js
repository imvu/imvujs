module.exports = function(child, parent, proto) {
	var descriptors = {};
	extd(child.prototype, descriptors);
	if (proto) extd(proto, descriptors);
	child.prototype = Object.create(parent.prototype, descriptors);
	child.super = parent;
};

function extd(obj, dest) {
	Object.getOwnPropertyNames(obj).forEach(function(name) {
		dest[name] = Object.getOwnPropertyDescriptor(obj, name);
	});
}
